import { SetMetadata } from '@nestjs/common';
import { EUserRole } from 'src/common/enums/user.enums';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: EUserRole[]) => SetMetadata(ROLES_KEY, roles);
