import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErgoPayService } from './ergopay.service';
import { ErgoPayController } from './ergopay.controller';
import { ErgoPay } from './entities/ergopay.entity';
import { ErgoPayAddress } from './entities/ergopay-address.entity';
import { NonceService } from '../auth/nonceService';
import { SupabaseService } from '../supabase/supabase.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([ErgoPay, ErgoPayAddress]), ConfigModule],
  controllers: [ErgoPayController],
  providers: [ErgoPayService, NonceService, SupabaseService],
  exports: [ErgoPayService],
})
export class ErgoPayModule {}
