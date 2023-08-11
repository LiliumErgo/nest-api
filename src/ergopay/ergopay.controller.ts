import { Controller, Get, Param } from '@nestjs/common';
import { ErgoPayService } from './ergopay.service';

@Controller('ergopay')
export class ErgoPayController {
  constructor(private readonly ergoPayService: ErgoPayService) {}

  @Get('generateShortLink/:base64Data')
  async generateShortLink(
    @Param('base64Data') base64Data: string,
  ): Promise<{ shortCode: string }> {
    const shortCode = await this.ergoPayService.generateErgoPayShortLink(
      base64Data,
    );
    return { shortCode: shortCode };
  }

  @Get('generateAddressLink/:uuid/:address')
  async generateAddressLink(
    @Param('uuid') uuid: string,
    @Param('address') address: string,
  ): Promise<{ message: string }> {
    const shortCode = await this.ergoPayService.createAddressLink(
      uuid,
      address,
    );
    if (shortCode) {
      return { message: 'successfully connected' };
    }
    return { message: 'connection failed' };
  }

  @Get('address/:uuid')
  async getAddress(@Param('uuid') uuid: string): Promise<{ address: string }> {
    const shortCode = await this.ergoPayService.getAddress(uuid);
    return { address: shortCode };
  }

  @Get('reducedTxLink/:uuid')
  async getReducedTxLink(@Param('uuid') uuid: string): Promise<string> {
    return await this.ergoPayService.getReducedTxLink(uuid);
  }
}
