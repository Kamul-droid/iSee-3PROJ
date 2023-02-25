import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './schema/user.schema';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Cache } from 'cache-manager';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(req: CreateUserDto): Promise<User> {
    const salt = await bcrypt.genSalt(10);

    req.password = await bcrypt.hash(req.password, salt);

    const data = new this.userModel(req);
    const user = await data.save();
    return user.toObject();
  }

  async update(id: mongoose.Types.ObjectId, req: UpdateUserDto): Promise<User> {
    if (req.password) {
      const salt = await bcrypt.genSalt(10);

      req.password = await bcrypt.hash(req.password, salt);
    }

    const data = await this.userModel
      .findByIdAndUpdate(id, req, { new: true })
      .lean();

    return data;
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email }).lean();
  }

  async sendConfirmationEmail(id: mongoose.Types.ObjectId) {
    await this.cacheManager.set(id.toString(), 'hash', 1000 * 60 * 10);
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
