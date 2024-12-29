import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@supabase/supabase-js';
import { Configuration, DefaultApiFactory } from '../explorerApi';
import {
  EXPLORER_API_URL,
  SUPABASE_ERGOPAY_API_KEY,
  SUPABASE_ERGOPAY_LINK,
} from '../api/api';
import { ErgoAddress } from '@fleet-sdk/core';
import { Signature } from '../auth/auth.service';

@Injectable()
export class ErgoPayService {
  private readonly explorerConf = new Configuration({
    basePath: EXPLORER_API_URL(),
  });
  private readonly explorerClient = DefaultApiFactory(this.explorerConf);
  async generateErgoPayShortLink(base64Txn: string): Promise<string> {
    try {
      const supabase = createClient(
        SUPABASE_ERGOPAY_LINK(),
        SUPABASE_ERGOPAY_API_KEY(),
      );
      const uuid = uuidv4().substr(0, 6);

      const { data, error } = await supabase
        .from('ergopay')
        .insert([
          {
            uuid: uuid,
            base_64: `ergopay:${base64Txn}`,
          },
        ])
        .select();

      if (error) {
        console.log('SupaBase Error');
        console.log(error);
        return 'null';
      }

      return uuid;
    } catch (error) {
      console.log(error);
      return 'null';
    }
  }

  async createAddressLink(uuid: string, address: string): Promise<string> {
    if (!ErgoAddress.validate(address)) {
      return 'null';
    }
    try {
      const supabase = createClient(
        SUPABASE_ERGOPAY_LINK(),
        SUPABASE_ERGOPAY_API_KEY(),
      );

      const { data, error } = await supabase
        .from('ergopay_address')
        .insert([
          {
            uuid: uuid,
            address: address,
          },
        ])
        .select();

      if (error) {
        console.log('SupaBase Error');
        console.log(error);
        return 'null';
      }
      return uuid;
    } catch (error) {
      return 'null';
    }
  }

  async writeVerification(
    uuid: string,
    verification: Signature,
  ): Promise<boolean> {
    try {
      const supabase = createClient(
        SUPABASE_ERGOPAY_LINK(),
        SUPABASE_ERGOPAY_API_KEY(),
      );

      const { data, error } = await supabase
        .from('ergopay_address')
        .update({ verification: verification })
        .eq('uuid', uuid);

      if (error) {
        console.log('SupaBase Error');
        console.log(error);
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  async writeNonce(uuid: string, nonce: string): Promise<boolean> {
    try {
      const supabase = createClient(
        SUPABASE_ERGOPAY_LINK(),
        SUPABASE_ERGOPAY_API_KEY(),
      );

      const { data, error } = await supabase
        .from('ergopay_address')
        .update({ nonce: nonce })
        .eq('uuid', uuid);

      if (error) {
        console.log('SupaBase Error');
        console.log(error);
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  async getAddress(uuid: string): Promise<string | undefined> {
    try {
      const supabase = createClient(
        SUPABASE_ERGOPAY_LINK(),
        SUPABASE_ERGOPAY_API_KEY(),
      );
      const { data, error } = await supabase
        .from('ergopay_address')
        .select('*')
        .eq('uuid', uuid);

      if (error) {
        console.log('SupaBase Error');
        console.log(error);
        return undefined;
      }
      return data[0].address;
    } catch (error) {
      return undefined;
    }
  }

  async getProof(uuid: string): Promise<string | undefined> {
    try {
      const supabase = createClient(
        SUPABASE_ERGOPAY_LINK(),
        SUPABASE_ERGOPAY_API_KEY(),
      );
      const { data, error } = await supabase
        .from('ergopay_address')
        .select('*')
        .eq('uuid', uuid);

      if (error) {
        console.log('SupaBase Error');
        console.log(error);
        return undefined;
      }
      return data[0].verification.proof;
    } catch (error) {
      return undefined;
    }
  }

  async getNonce(uuid: string): Promise<string | undefined> {
    try {
      const supabase = createClient(
        SUPABASE_ERGOPAY_LINK(),
        SUPABASE_ERGOPAY_API_KEY(),
      );
      const { data, error } = await supabase
        .from('ergopay_address')
        .select('*')
        .eq('uuid', uuid);

      if (error) {
        console.log('SupaBase Error');
        console.log(error);
        return undefined;
      }
      return data[0].nonce;
    } catch (error) {
      return undefined;
    }
  }

  async getReducedTxLink(
    uuid: string,
    message: string,
    address: string,
  ): Promise<
    | {
        reducedTx: string;
        message: string;
        messageSeverity: string;
        address: string;
      }
    | string
  > {
    try {
      const supabase = createClient(
        SUPABASE_ERGOPAY_LINK(),
        SUPABASE_ERGOPAY_API_KEY(),
      );
      const { data, error } = await supabase
        .from('ergopay')
        .select('*')
        .eq('uuid', uuid);

      if (error) {
        console.log('SupaBase Error');
        console.log(error);
        return 'null';
      }

      const reducedTx: string = data[0].base_64.slice(8);
      return {
        reducedTx: reducedTx,
        message: message,
        messageSeverity: 'INFORMATION',
        address: address,
      };
    } catch (error) {
      return 'null';
    }
  }
}
