import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Address, verify_signature } from 'ergo-lib-wasm-nodejs';
import { ErgoAddress, Network } from '@fleet-sdk/core';
import { SupabaseClient } from '@supabase/supabase-js';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwt = require('jsonwebtoken');

export interface Signature {
  signedMessage: string;
  proof: string;
}

@Injectable()
export class AuthService {
  private readonly TIMESTAMP: number = 2;
  private readonly ORIGIN: number = 1;

  verifySignature(signature: Signature, address: string): boolean {
    try {
      const arr: string[] = signature.signedMessage.split(';');

      if (arr.length !== 4) {
        return false;
      }

      const timestamp = parseInt(arr[this.TIMESTAMP], 10) * 1000;
      const origin = arr[this.ORIGIN];

      const moreThen10SecPassed = false;

      if (moreThen10SecPassed) {
        return false;
      }

      const networkAddress =
        ErgoAddress.getNetworkType(address) === Network.Mainnet
          ? Address.from_mainnet_str(address)
          : Address.from_testnet_str(address);

      return verify_signature(
        networkAddress,
        Buffer.from(signature.signedMessage, 'utf-8'),
        Buffer.from(signature.proof, 'hex'),
      );
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async getUserData(
    supabase: SupabaseClient<any, 'public', any>,
    address: string,
  ): Promise<string> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('address', address);
    if (error) {
      throw error;
    }
    return data[0];
  }

  async createUser(
    supabase: SupabaseClient<any, 'public', any>,
    address: string,
  ): Promise<string> {
    const { data, error } = await supabase.auth.admin.createUser({
      email: `${address}@ergoplatform.com`,
      user_metadata: { address: address },
    });
    if (error) {
      throw error;
    }
    return data.user.id;
  }

  async updateUserData(
    supabase: SupabaseClient<any, 'public', any>,
    address: string,
    user: string,
  ): Promise<void> {
    const newNonce = Math.floor(Math.random() * 1000000).toString();

    const { data: updatedData, error: updateError } = await supabase
      .from('users')
      .update({
        auth: {
          genNonce: newNonce, // update the nonce, so it can't be reused
          lastAuth: new Date().toISOString(),
          lastAuthStatus: 'success',
        },
        user_id: user, // same uuid as auth.users table
      })
      .eq('address', address); // primary key

    if (updateError) {
      throw updateError;
    }
  }
}
