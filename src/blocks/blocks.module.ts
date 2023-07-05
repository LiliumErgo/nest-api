// import { Module } from '@nestjs/common';
// import { ClientsModule, Transport } from '@nestjs/microservices';
// import { BlocksController } from './blocks.controller';
// import { BlocksService } from './blocks.service';
//
// @Module({
//   imports: [
//     ClientsModule.register([
//       {
//         name: 'BLOCK_SERVICE',
//         transport: Transport.KAFKA,
//         options: {
//           client: {
//             clientId: 'blocks',
//             brokers: ['localhost:9092'],
//           },
//           consumer: {
//             groupId: 'blocks-consumer',
//           },
//         },
//       },
//     ]),
//   ],
//   controllers: [BlocksController],
//   providers: [BlocksService],
// })
// export class BlocksModule {}
