import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SupabaseService } from '../supabase/supabase.service';
import { NonceService } from './nonceService';

@Module({
  controllers: [AuthController],
  providers: [AuthService, SupabaseService, NonceService],
})
export class AuthModule {}
