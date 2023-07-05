// import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
// import { ClientKafka } from '@nestjs/microservices';
// import axios from 'axios';
//
// @Injectable()
// export class BlocksService implements OnModuleInit {
//   private readonly nodeUrl: string = 'https://ergo-fastnet-node.pai.systems';
//   private previousBlockNumber: number;
//
//   constructor(
//     @Inject('BLOCK_SERVICE') private readonly blockClient: ClientKafka,
//   ) {}
//
//   onModuleInit() {
//     setInterval(async () => {
//       const latestBlockNumber = await this.getLatestBlock();
//       if (latestBlockNumber !== this.previousBlockNumber) {
//         this.updateBlock(latestBlockNumber);
//         this.previousBlockNumber = latestBlockNumber;
//       }
//     }, 3000);
//   }
//
//   private async getLatestBlock(): Promise<number> {
//     const url = `${this.nodeUrl}/info`;
//     const response = await axios.get(url);
//     const data: Info = response.data;
//     return data.fullHeight;
//   }
//
//   updateBlock(blockNumber: number) {
//     this.blockClient.emit('new_block', blockNumber);
//   }
// }
