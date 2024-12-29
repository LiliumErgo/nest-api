import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
// import necessary dependencies, services etc.

@Injectable()
export class NonceService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async createNonce(address: string): Promise<string> {
    const nonce = Math.floor(Math.random() * 1000000).toString();
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('users')
      .select('address')
      .eq('address', address);

    if (error || data.length === 0) {
      // Address not found, create new entry
      const { error: insertError } = await supabase.from('users').insert({
        address: address,
        auth: {
          genNonce: nonce,
          lastAuth: new Date().toISOString(),
          lastAuthStatus: 'pending',
        },
      });

      if (insertError) {
        console.log(insertError);
        throw new HttpException(
          'Error creating new entry',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } else {
      // Address found, update the entry
      const updateRes = await supabase
        .from('users')
        .update({
          auth: {
            genNonce: nonce,
            lastAuth: new Date().toISOString(),
            lastAuthStatus: 'pending',
          },
        })
        .eq('address', address);

      if (updateRes.error) {
        throw new HttpException(
          'Error updating nonce',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
    return nonce;
  }
}
