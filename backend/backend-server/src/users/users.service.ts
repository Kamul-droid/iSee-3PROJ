import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './schema/user.schema';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

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
}
