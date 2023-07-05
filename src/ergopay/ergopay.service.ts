import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Configuration, DefaultApiFactory } from '../explorerApi';
import {
  EXPLORER_API_URL,
  LINK_SHORTNER_API_KEY,
  LINK_SHORTNER_BACKEND_URL,
} from '../api/api';

@Injectable()
export class ErgoPayService {
  private readonly explorerConf = new Configuration({
    basePath: EXPLORER_API_URL(),
  });
  private readonly explorerClient = DefaultApiFactory(this.explorerConf);
  getHello(): string {
    return 'Hello World!';
  }

  private isBase64(str: string): boolean {
    const base64Regex =
      /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
    return base64Regex.test(str);
  }
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
}
