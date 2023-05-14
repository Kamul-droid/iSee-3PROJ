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
  Model,
  ProjectionType,
  UpdateQuery,
} from 'mongoose';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './schema/user.schema';
import { VideoService } from 'src/videos/video.service';
import { EVideoState } from 'src/common/enums/video.enums';
import { STATIC_PATH_PROFILE_PICTURES } from 'src/init-static-paths';
import { CommentService } from 'src/comments/comment.service';
import { removeUndefined } from 'src/common/helpers/removeUndefined';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(forwardRef(() => VideoService))
    private readonly videoService: VideoService,
    @Inject(forwardRef(() => CommentService))
    private readonly commentService: CommentService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly mailService: MailerService,
  ) {}

  async create(req: CreateUserDto): Promise<User> {
    const salt = await bcrypt.genSalt(10);

    req.password = await bcrypt.hash(req.password, salt);

    const data = new this.userModel(req);
    const user = await data.save();

    // send validation email
    this.sendConfirmationEmail(user._id, user.email);
    return user.toObject();
  }

  async update(
    id: mongoose.Types.ObjectId,
    req: UpdateQuery<User>,
  ): Promise<any> {
    if (req.password) {
      const salt = await bcrypt.genSalt(10);

      req.password = await bcrypt.hash(req.password, salt);
    }

    const data = await this.userModel
      .findByIdAndUpdate(id, req, { new: true })
      .lean();

    if (req.username || req.avatar) {
      const update = removeUndefined({
        username: req.username,
        avatar: req.avatar,
      });

      this.commentService.updateMany(
        { 'authorInfos._id': id },
        { authorInfos: update },
      );
      this.videoService.updateMany(
        { 'uploaderInfos._id': id },
        { uploaderInfos: update },
      );
    }

    return data;
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email });
  }

  async findById(_id: string): Promise<User> {
    return await this.userModel.findOne({ _id }).lean();
  }

  async deleteAccount(_id: string): Promise<User> {
    const res = await this.userModel.findByIdAndRemove(_id);

    this.videoService.updateMany(
      { 'uploaderInfos._id': _id },
      { state: EVideoState.UPLOADER_DELETED },
    );

    this.commentService.deleteMany({ 'authorInfos._id': _id });

    return res;
  }

  async sendConfirmationEmail(id: mongoose.Types.ObjectId, email: string) {
    const token = crypto.randomBytes(20).toString('hex');

    const _id = id.toString();
    const validationLink = `http:localhost/validate-mail?csr=${_id}&token=${token}`;
    await this.mailService.sendMail({
      to: email,
      subject: 'Email validation',
      template: 'email-validation',
      context: { validationLink: validationLink },
    });

    await this.cacheManager.set(id.toString(), token, 1000 * 60 * 10);
  }

  async find(filter?: FilterQuery<User>, select?: ProjectionType<User>) {
    return await this.userModel.find(filter, select);
  }

  async createMany(users: User[]) {
    return await this.userModel.insertMany(users);
  }

  async deleteMany(filter: FilterQuery<User>) {
    return await this.userModel.deleteMany(filter);
  }

  async getCount() {
    return await this.userModel.find().count();
  }

  async validateConfirmationEmail(id: mongoose.Types.ObjectId, token: string) {
    const data = await this.cacheManager.get(id.toString());
    if (data == token) {
      await this.cacheManager.del(id.toString());
      return await this.update(id, { state: { isEmailValidated: true } });
    }
    return null;
  }

  async setProfilePic(id: string, file: Express.Multer.File) {
    const profilePicName = `${file.filename}.${file.mimetype.split('/').pop()}`;
    const profilePicPath = `${STATIC_PATH_PROFILE_PICTURES}/${profilePicName}`;

    fs.copyFileSync(file.path, profilePicPath);
    fs.unlinkSync(file.path);
    return await this.update(new mongoose.Types.ObjectId(id), {
      avatar: profilePicName,
    });
  }
}
