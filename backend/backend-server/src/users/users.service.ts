import { MailerService } from '@nestjs-modules/mailer';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Cache } from 'cache-manager';
import * as crypto from 'crypto';
import mongoose, { Model, UpdateQuery } from 'mongoose';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './schema/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,

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
  ): Promise<User> {
    if (req.password) {
      const salt = await bcrypt.genSalt(10);

      req.password = await bcrypt.hash(req.password, salt);
    }

    const data = await this.userModel.findByIdAndUpdate(id, req, { new: true });

    return data;
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email });
  }

  async findById(_id: string): Promise<User> {
    return await this.userModel.findOne({ _id });
  }

  async deleteAccount(_id: string): Promise<User> {
    const res = await this.userModel.findByIdAndRemove(_id);

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

  async getAll() {
    return await this.userModel.find();
  }

  async validateConfirmationEmail(id: mongoose.Types.ObjectId, token: string) {
    const data = await this.cacheManager.get(id.toString());
    if (data == token) {
      await this.cacheManager.del(id.toString());
      return await this.update(id, { state: { isEmailValidated: true } });
    }
    return null;
  }
}
