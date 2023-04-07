import { AuthGuard } from '@nestjs/passport';

export class JwtAuthGuardOptional extends AuthGuard('jwt') {
  // Override handleRequest so it never throws an error
  handleRequest(err, user) {
    return user;
  }
}
