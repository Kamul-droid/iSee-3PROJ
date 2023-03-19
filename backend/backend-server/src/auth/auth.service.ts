import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from 'src/users/dtos/login-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(req: LoginUserDto) {
    const user = await this.usersService.findByEmail(req.email);

    if (user && bcrypt.compare(req.password, user.password)) {
      const { password, ...res } = user;
      return res;
    }

    return null;
  }

  async login(user: any) {
    const payload = { sub: user._id, username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        username: user.username,
        email: user.email,
        _id: user._id,
      },
    };
  }
}
