import { Controller, Get, Param } from '@nestjs/common';
import { ErgoPayService } from './ergopay.service';

@Controller('ergopay')
export class ErgoPayController {
  constructor(private readonly ergoPayService: ErgoPayService) {}

  @Get('generateShortLink/:base64Data')
  async setBlock(
    @Param('base64Data') base64Data: string,
  ): Promise<{ shortCode: string }> {
    const shortCode = await this.ergoPayService.generateErgoPayShortLink(
      base64Data,
    );
    return { shortCode: shortCode };
  }
}
