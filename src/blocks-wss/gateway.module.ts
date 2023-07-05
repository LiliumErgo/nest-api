import { Module } from '@nestjs/common';
import { BlockGateway } from './gateway';
import { GatewayService } from './gateway.service';

@Module({
  providers: [BlockGateway, GatewayService],
})
export class GatewayModule {}
