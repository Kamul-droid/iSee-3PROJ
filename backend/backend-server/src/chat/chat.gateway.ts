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

  handleConnection(client: Socket, ...args: any) {
    try {
      const res = this.jwtService.verify(client.handshake.auth.token || '');
      client.join(client.handshake.query.videoId);
      console.log(res);
    } catch (e) {
      console.log(e);
      client.disconnect();
    }
  }

  @SubscribeMessage('chat')
  async handleEvent(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): Promise<WsResponse<any>> {
    this.io.to(client.handshake.query.videoId).emit('chat', data);
    return data;
  }
}
