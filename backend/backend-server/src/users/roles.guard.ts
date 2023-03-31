import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { EUserRole } from 'src/common/enums/user.enums';
import { ROLES_KEY } from './roles.decorator';
import { UsersService } from './users.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndMerge<EUserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles?.length) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();

    const { role } = await this.usersService.findById(user._id);

    if (!requiredRoles.includes(role)) {
      return true;
    } else {
      throw new ForbiddenException(
        'You cannot access this resource with your role',
      );
    }
  }
}
