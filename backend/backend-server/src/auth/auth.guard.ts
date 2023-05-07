import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import {
  DISABLE_AUTH_KEY,
  EAuth,
} from 'src/common/decorators/auth-mode.decorator';
import { env } from 'src/env';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(JwtService)
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authMode = this.reflector.getAllAndOverride<EAuth>(DISABLE_AUTH_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (authMode === EAuth.DISABLED) {
      return true;
    }

    const req: Request = context.switchToHttp().getRequest();

    const token = req.headers.authorization.split(' ').pop();

    if (!token && authMode !== EAuth.OPTIONAL) {
      return false;
    }

    const jwtPayload = await this.jwtService.verify(token, {
      secret: env().jwtSecret,
    });

    const { password, ...user } = await this.usersService.findById(
      jwtPayload.sub,
    );

    req.user = user;

    return true;
  }
}
