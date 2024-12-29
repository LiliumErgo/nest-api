import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Server } from 'socket.io';
import { Subscriber } from 'zeromq';

@Injectable()
export class GatewayService implements OnModuleInit {
  private readonly nodeUrl: string;
  private server: Server;

  constructor(private configService: ConfigService) {
    const isMainnet = this.configService.get<string>('IS_MAINNET') === 'true';
    this.nodeUrl = (
      isMainnet
        ? this.configService.get<string>('NODE_MAINNET_API_URL')
        : this.configService.get<string>('NODE_TESTNET_API_URL')
    )?.replace(/[\\/]+$/, '');
  }

  setServer(server: Server) {
    this.server = server;
  }

  onModuleInit() {
    this.startSocket();
  }

  private async getLatestBlock(): Promise<number> {
    const url = `${this.nodeUrl}/info`;
    const response = await axios.get(url);
    const data: Info = response.data;
    return data.fullHeight;
  }

  private async startSocket(): Promise<void> {
    const sock = new Subscriber();
    const isMainnet = this.configService.get<string>('IS_MAINNET') === 'true';
    const listenerUrl = (
      isMainnet
        ? this.configService.get<string>('NODE_MAINNET_LISTENER_URL')
        : this.configService.get<string>('NODE_TESTNET_LISTENER_URL')
    )?.replace(/[\\/]+$/, '');

    sock.connect(listenerUrl);

    sock.subscribe('newBlock');

    for await (const [topic, msg] of sock) {
      // Convert the topic and message to strings
      const topicStr = topic.toString();
      const msgStr = msg.toString();

      if (topicStr === 'newBlock') {
        const blockHash = msgStr.slice(0, 64);
        this.updateBlock(blockHash);
      }
    }
  }

  updateBlock(blockHash: string) {
    this.server.emit('new_block', blockHash);
  }
}
