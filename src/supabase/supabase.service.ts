import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly supabaseClient: SupabaseClient;

  constructor(private configService: ConfigService) {
    this.supabaseClient = createClient(
      this.configService.get<string>('SUPABASE_LILIUM_LINK'),
      this.configService.get<string>('SUPABASE_LILIUM_API_KEY'),
    );
  }

  public getClient(): SupabaseClient {
    return this.supabaseClient;
  }
}
