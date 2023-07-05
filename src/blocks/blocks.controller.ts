// import {Controller, Get, Param} from '@nestjs/common';
// import { BlocksService } from './blocks.service';
// import { EventPattern } from '@nestjs/microservices';
//
// @Controller('blocks')
// export class BlocksController {
//   constructor(private readonly blocksService: BlocksService) {}
//
//   @EventPattern('new_block')
//   handleNewBlock(data: any) {
//     console.log("hello");
//   }
//
//   @Get('setBlock/:id')
//   setBlock(@Param('id') id: string): string {
//     this.blocksService.updateBlock(Number(id));
//     console.log('updating');
//     return 'done';
//   }
// }
