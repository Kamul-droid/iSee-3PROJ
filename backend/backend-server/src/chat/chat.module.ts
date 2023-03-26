import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { env } from 'src/env';
import { ChatGateway } from './chat.gateway';

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
