import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './schema/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(req: CreateUserDto): Promise<User> {
    const salt = await bcrypt.genSalt(10);

    req.password = await bcrypt.hash(req.password, salt);

    const data = new this.userModel(req);
    return data.save();
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email }).lean();
  }
}
