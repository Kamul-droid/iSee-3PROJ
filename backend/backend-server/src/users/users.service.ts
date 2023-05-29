import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Cache } from 'cache-manager';
import * as crypto from 'crypto';
import * as fs from 'fs';
import mongoose, {
  FilterQuery,
  LeanDocument,
  Model,
  ProjectionType,
  UpdateQuery,
} from 'mongoose';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './schema/user.schema';
import { VideosService } from 'src/videos/videos.service';
import { EVideoState } from 'src/common/enums/video.enums';
import { STATIC_PATH_PROFILE_PICTURES } from 'src/ensure-static-paths';
import { CommentsService } from 'src/comments/comments.service';
import { removeUndefined } from 'src/common/helpers/removeUndefined';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(forwardRef(() => VideosService))
    @Inject(forwardRef(() => CommentsService))
    private readonly videoService: VideosService,
    private readonly commentService: CommentsService,
    private readonly mailService: MailerService,
  ) {}

  /**
   * Creates a user and sends a confirmation email.
   * @param req
   * @returns The created user
   */
  async create(req: CreateUserDto): Promise<LeanDocument<User>> {
    const salt = await bcrypt.genSalt(10);

    req.password = await bcrypt.hash(req.password, salt);

    const user = await this.userModel.create(req);

    // send validation email
    this.sendConfirmationEmail(user._id, user.email);
    return user.toObject();
  }

  /**
   * Updates user informations, the update is asynchronously cascaded for all of this
   * user's videos and comments.
   * @param _id User mongo ID
   * @param update User data to update
   * @returns Updated user
   */
  async update(_id: string, update: UpdateQuery<User>): Promise<any> {
    /**
     * If the update is a password change, it needs to be hashed.
     */
    if (update.password) {
      const salt = await bcrypt.genSalt(10);

      update.password = await bcrypt.hash(update.password, salt);
    }

    const data = await this.userModel
      .findByIdAndUpdate(_id, update, { new: true })
      .lean();

    /**
     * Video and comment updates are done asynchronously in order to avoid
     * slowing down the response time.
     * Errors are safely caught in case of an error due to the async calls.
     */
    if (update.username || update.avatar) {
      const cascadeUpdate = removeUndefined({
        username: update.username,
        avatar: update.avatar,
      });

      this.commentService
        .updateMany({ 'authorInfos._id': _id }, { authorInfos: cascadeUpdate })
        .catch((err) =>
          console.log('Error occured during update many process:' + err),
        );
      this.videoService
        .updateMany(
          { 'uploaderInfos._id': _id },
          { uploaderInfos: cascadeUpdate },
        )
        .catch((err) =>
          console.log('Error occured during update many process:' + err),
        );
    }

    return data;
  }

  /**
   * Finds a user by email.
   * Used for authentication.
   * @param email
   * @returns
   */
  async findByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email });
  }

  /**
   * Finds a user by mongo ID.
   * @param _id
   * @returns
   */
  async findById(_id: string): Promise<User> {
    return await this.userModel.findOne({ _id }).lean();
  }

  /**
   * Deletes a specific user account.
   * @param _id
   * @returns
   */
  async deleteAccount(_id: string): Promise<User> {
    const res = await this.userModel.findByIdAndRemove(_id);

    this.videoService
      .updateMany(
        { 'uploaderInfos._id': _id },
        { state: EVideoState.UPLOADER_DELETED },
      )
      .catch((e) => console.log('Videos cascade update failed: ' + e));

    this.commentService
      .deleteMany({ 'authorInfos._id': _id })
      .catch((e) => console.log('Comments cascade delete failed: ' + e));

    return res;
  }

  /**
   * Sends a confirmation email to the user with a secret attached.
   * This secret is cached for later validation once the user clicks on the
   * email's link.
   * @param _id
   * @param email
   */
  async sendConfirmationEmail(_id: string, email: string) {
    const token = crypto.randomBytes(20).toString('hex');

    const validationLink = `http:localhost/validate-mail?csr=${_id}&token=${token}`;
    await this.mailService.sendMail({
      to: email,
      subject: 'Email validation',
      template: 'email-validation',
      context: { validationLink: validationLink },
    });

    await this.cacheManager.set(_id, token, 1000 * 60 * 10);
  }

  /**
   * Finds many users.
   * @param filter
   * @param select
   * @returns
   */
  async find(filter?: FilterQuery<User>, select?: ProjectionType<User>) {
    return await this.userModel.find(filter, select);
  }

  /**
   * Gets the count of registered users
   * @returns
   */
  async getCount() {
    return await this.userModel.find().count();
  }

  /**
   * Validates the user using the secret sent to him via email by the
   * sendConfirmationEmail method.
   * @param _id
   * @param token
   * @returns
   * @see sendConfirmationEmail
   */
  async validateConfirmationEmail(_id: string, token: string) {
    const data = await this.cacheManager.get(_id);
    if (data == token) {
      await this.cacheManager.del(_id);
      return await this.update(_id, { state: { isEmailValidated: true } });
    }
    return null;
  }

  /**
   * Sets a new profile picture for the user and deletes any previous one from storage.
   * @param _id
   * @param file
   * @returns
   */
  async setProfilePic(_id: string, file: Express.Multer.File) {
    const profilePicName = `${file.filename}.${file.mimetype.split('/').pop()}`;
    const profilePicPath = `${STATIC_PATH_PROFILE_PICTURES}/${profilePicName}`;

    fs.copyFileSync(file.path, profilePicPath);
    fs.unlinkSync(file.path);
    return await this.update(_id, { avatar: profilePicName });
  }

  /**
   * [For testing purposes] Creates many users.
   * @param users
   * @returns
   */
  async createMany(users: User[]) {
    return await this.userModel.insertMany(users);
  }

  /**
   * [For testing purposes] Deletes many users based on a filter.
   * @param filter
   * @returns
   */
  async deleteMany(filter: FilterQuery<User>) {
    return await this.userModel.deleteMany(filter);
  }
}
