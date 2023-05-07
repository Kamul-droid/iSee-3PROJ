import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [JwtModule],
  providers: [ChatGateway],
})
export class ChatModule {}
