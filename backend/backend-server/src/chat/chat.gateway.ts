import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  io: Server;

  @Inject(JwtService)
  jwtService: JwtService;

  handleConnection(client: Socket) {
    try {
      this.jwtService.verify(client.handshake.auth.token || '');
    } catch (e) {
      client.disconnect();
    }
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): Promise<WsResponse<any>> {
    client.join(data.videoId);
    this.io
      .to(data.videoId)
      .emit('chat', `${data.user.username} just joined the chat`);
    return data;
  }

  @SubscribeMessage('chat')
  async handleChatMessage(@MessageBody() data: any): Promise<WsResponse<any>> {
    this.io.to(data.videoId).emit('chat', data);
    return data;
  }
}
