import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  SUPABASE_ERGOPAY_API_KEY,
  SUPABASE_ERGOPAY_LINK,
  SUPABASE_LILIUM_API_KEY,
  SUPABASE_LILIUM_LINK
} from '../api/api';

@Injectable()
export class SupabaseService {
  private readonly supabaseClient: SupabaseClient;

  constructor() {
    this.supabaseClient = createClient(
      SUPABASE_LILIUM_LINK(),
      SUPABASE_LILIUM_API_KEY(),
    );
  }

  public getClient(): SupabaseClient {
    return this.supabaseClient;
  }
}
