import {
  WebSocketServer,
  WebSocketGateway,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { GatewayService } from './gateway.service';
@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', '.liliumergo.io'],
  },
})
export class BlockGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  constructor(private readonly gatewayService: GatewayService) {}

  afterInit(server: Server) {
    this.gatewayService.setServer(server);
  }
}
