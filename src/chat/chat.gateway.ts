import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect{
  @WebSocketServer() server;
  rooms: string[] = [];
  users = 0;


  async handleConnection(socket: Socket){

    // A client has connected
    this.users++;

    // Notify connected clients of current users
    this.server.emit('users', this.users);

  }

  async handleDisconnect(socket: Socket){

    // A client has disconnected
    this.users--;

    // Notify connected clients of current users
    this.server.emit('users', this.users);

  }

  @SubscribeMessage('chat')
  async onChat(client, message){
    console.log(message);
    client.broadcast.to('777').emit('chat', message);
  }

  @SubscribeMessage('joinRoom')
  async onJoinRoom(client: Socket, message){

    client.broadcast.to(message.bandId).emit('users', `${message.userId} joined room`)
  }
}
