import { Module } from '@nestjs/common';
import { ErgoPayController } from './ergopay.controller';
import { ErgoPayService } from './ergopay.service';
import { SupabaseService } from '../supabase/supabase.service';
import { NonceService } from '../auth/nonceService';

@Module({
  controllers: [ErgoPayController],
  providers: [ErgoPayService, SupabaseService, NonceService],
})
export class ErgoPayModule {}
