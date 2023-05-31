import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ChatGateway } from './chat.gateway';
import { env } from 'src/env';

@Module({
  imports: [
    JwtModule.register({
      secret: env().jwtSecret,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [ChatGateway],
})
export class ChatModule {}
