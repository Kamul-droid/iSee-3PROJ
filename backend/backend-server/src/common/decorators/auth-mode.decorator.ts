import { SetMetadata } from '@nestjs/common';

export enum EAuth {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED',
  OPTIONAL = 'OPTIONAL',
}

export const DISABLE_AUTH_KEY = 'disable_auth';
export const AuthMode = (mode: EAuth) => SetMetadata(DISABLE_AUTH_KEY, mode);
