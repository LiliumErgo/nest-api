import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Configuration, DefaultApiFactory } from '../explorerApi';
import {
  EXPLORER_API_URL,
  LINK_SHORTNER_API_KEY,
  LINK_SHORTNER_BACKEND_URL,
} from '../api/api';
import { ErgoAddress } from '@fleet-sdk/core';

@Injectable()
export class ErgoPayService {
  private readonly explorerConf = new Configuration({
    basePath: EXPLORER_API_URL(),
  });
  private readonly explorerClient = DefaultApiFactory(this.explorerConf);
  async generateErgoPayShortLink(base64Txn: string): Promise<string> {
    try {
      const res = await axios.post(
        `${LINK_SHORTNER_BACKEND_URL()}/rest/v3/short-urls`,
        {
          longUrl: `ergopay:${base64Txn}`,
          findIfExists: false,
          validateUrl: false,
          forwardQuery: true,
        },
        {
          headers: {
            'x-api-key': `${LINK_SHORTNER_API_KEY()}`,
          },
        },
      );
      return res.data.shortCode;
    } catch (error) {
      return 'null';
    }
  }

  async createAddressLink(uuid: string, address: string): Promise<string> {
    if (!ErgoAddress.validate(address)) {
      return 'null';
    }
    try {
      const res = await axios.post(
        `${LINK_SHORTNER_BACKEND_URL()}/rest/v3/short-urls`,
        {
          longUrl: `{"address":"${address}"}`,
          findIfExists: false,
          validateUrl: false,
          forwardQuery: true,
          customSlug: uuid,
        },
        {
          headers: {
            'x-api-key': `${LINK_SHORTNER_API_KEY()}`,
          },
        },
      );
      return res.data.shortCode;
    } catch (error) {
      return 'null';
    }
  }

  async getAddress(uuid: string): Promise<string> {
    try {
      const res = await axios.get(
        `${LINK_SHORTNER_BACKEND_URL()}/rest/v3/short-urls/${uuid}`,
        {
          headers: {
            'x-api-key': `${LINK_SHORTNER_API_KEY()}`,
          },
        },
      );
      return JSON.parse(res.data.longUrl).address;
    } catch (error) {
      return 'null';
    }
  }

  async getReducedTxLink(uuid: string): Promise<string> {
    try {
      const res = await axios.get(
        `${LINK_SHORTNER_BACKEND_URL()}/rest/v3/short-urls/${uuid}`,
        {
          headers: {
            'x-api-key': `${LINK_SHORTNER_API_KEY()}`,
          },
        },
      );
      return res.data.longUrl;
    } catch (error) {
      return 'null';
    }
  }
}
