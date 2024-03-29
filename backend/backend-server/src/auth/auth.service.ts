import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from 'src/users/dtos/login-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { UserDocument } from 'src/users/schema/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Returns a user's data upon successful authentication.
   * Otherwise returns null.
   * @param req
   * @returns
   */
  async validateUser(req: LoginUserDto) {
    const user = await this.usersService.findByEmail(req.email);

    if (user && (await bcrypt.compare(req.password, user.password))) {
      return user;
    }

    return null;
  }

  /**
   * Signs the user's token upon login.
   * @param user
   * @returns
   */
  async login(user: UserDocument) {
    const payload = { sub: user._id, username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        username: user.username,
        bio: user.bio,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        state: user.state,
        _id: user._id,
      },
    };
  }
}
