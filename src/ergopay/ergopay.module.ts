import { Module } from '@nestjs/common';
import { ErgoPayController } from './ergopay.controller';
import { ErgoPayService } from './ergopay.service';

@Module({
  controllers: [ErgoPayController],
  providers: [ErgoPayService],
})
export class ErgoPayModule {}
