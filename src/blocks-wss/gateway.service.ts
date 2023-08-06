import { Injectable, OnModuleInit } from '@nestjs/common';
import axios from 'axios';
import { Server } from 'socket.io';
import { isMainnet, NODE_API_URL, NODE_LISTENER_URL} from '../api/api';
import { Subscriber } from 'zeromq';

@Injectable()
export class GatewayService implements OnModuleInit {
  private readonly nodeUrl: string = NODE_API_URL(isMainnet());
  private previousBlockNumber: number;
  private server: Server;

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

    // Connect to the server
    sock.connect(NODE_LISTENER_URL(isMainnet()));

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
