import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer, WsException,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { BandsService } from '../bands/bands.service';
import { AuthService } from '../shared/auth/auth.service';
import { ReceiveMessage, SendMessage } from './models/message.model';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect{

  constructor(private _bandsService: BandsService,
              private readonly _authService: AuthService){

  }
  @WebSocketServer() server;

  async handleConnection(socket: Socket){
  }

  async handleDisconnect(socket: Socket){
  }

  @SubscribeMessage('chat')
  async onChat(client: Socket, message: ReceiveMessage){
    const user = await this._authService.getUserFromToken(message.token);
    if(!user || !user.bands.includes(message.toChannel)){
      this.server.to(client.id).emit('chat',{content: 'You have no permissions to acces that chat.'});
      return;
    }
    const sendMessage: SendMessage = {
      content: message.content,
      displayname: user.displayname,
      avatarId: user.avatarId,
      date: Date.now(),
      userId: user.id
    };
    const band = await this._bandsService.fidnById(message.toChannel);
    band.messages.push(sendMessage);
    band.messages.splice(100);
    await this._bandsService.update(message.toChannel, band);
    client.broadcast.to(message.toChannel).emit('chat', sendMessage);
  }

  @SubscribeMessage('joinRoom')
  async onJoinRoom(client: Socket, message: ReceiveMessage){
    const user = await this._authService.getUserFromToken(message.token);
    console.log('Join Rom Event!');
    if(!user || !user.bands.includes(message.toChannel)){
      client.to(client.id).emit('chat',{content: 'You have no permissions to acces that chat.'});
    }
    const sendMessage = {
      content: `${user.displayname} joined room`,
      displayname: 'Server',
      avatarId: '',
      date:  Date.now(),
      userId: ''
    };
    const band = await this._bandsService.fidnById(message.toChannel);
    band.messages.push(sendMessage);
    band.messages.splice(100);
    await this._bandsService.update(message.toChannel, band);
    client.join(message.toChannel);
    client.broadcast.to(message.toChannel).emit('users', sendMessage);
    this.server.to(client.id).emit('messages', band.messages)
  }

  @SubscribeMessage('leaveRoom')
  async onLeaveRoom(client: Socket, message: ReceiveMessage){
    const user = await this._authService.getUserFromToken(message.token);
    console.log('Join Rom Event!');
    if(!user || !user.bands.includes(message.toChannel)){
      client.broadcast.to(client.id).emit('chat',{content: 'You have no permissions to acces that chat.'});
    }
    const sendMessage = {
      content: `${user.displayname} left room`,
      displayname: 'Server',
      avatarId: '',
      date: Date.now(),
      userId: ''
    };
    const band = await this._bandsService.fidnById(message.toChannel);
    band.messages.push(sendMessage);
    band.messages.splice(100);
    await this._bandsService.update(message.toChannel, band);
    client.leave(message.toChannel);
    client.broadcast.to(message.toChannel).emit('users', sendMessage);
  }
}
