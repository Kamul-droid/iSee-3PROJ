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

/**
 * Performs jwt authentication on three possible modes defined by the `@AuthMode` decorator:
 *
 * - ENABLED: authentication is performed (default)
 * - DISABLED: authentication is skipped
 * - OPTIONAL: authentication is only performed if a jwt is provided. This is useful if
 * we desire to do additional processing for authenticated user using the request's user object,
 * but still want the endpoint to be accessible by all
 */
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

    if (authMode === EAuth.OPTIONAL && !token) {
      return true;
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
