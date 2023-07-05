import { Injectable, OnModuleInit } from '@nestjs/common';
import axios from 'axios';
import { Server } from 'socket.io';
import { NODE_API_URL } from '../api/api';

@Injectable()
export class GatewayService implements OnModuleInit {
  private readonly nodeUrl: string = NODE_API_URL();
  private previousBlockNumber: number;
  private server: Server;

  setServer(server: Server) {
    this.server = server;
  }

  onModuleInit() {
    setInterval(async () => {
      const latestBlockNumber = await this.getLatestBlock();
      if (latestBlockNumber !== this.previousBlockNumber) {
        this.updateBlock(latestBlockNumber);
        this.previousBlockNumber = latestBlockNumber;
      }
    }, 3000);
  }

  private async getLatestBlock(): Promise<number> {
    const url = `${this.nodeUrl}/info`;
    const response = await axios.get(url);
    const data: Info = response.data;
    return data.fullHeight;
  }

  updateBlock(blockNumber: number) {
    this.server.emit('new_block', blockNumber);
  }
}
