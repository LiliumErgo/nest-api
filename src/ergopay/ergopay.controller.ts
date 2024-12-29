import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ErgoPayService } from './ergopay.service';
import * as assert from 'assert';
import { NonceService } from '../auth/nonceService';
import { ErgoAddress, ErgoTree } from '@fleet-sdk/core';
import { Signature } from '../auth/auth.service';

@Controller('ergopay')
export class ErgoPayController {
  constructor(
    private readonly ergoPayService: ErgoPayService,
    private readonly nonceService: NonceService,
  ) {}

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

  @Get('auth/:address')
  async auth(@Param('address') address: string): Promise<{
    userMessage: string;
    address: string;
    signingMessage: string;
    sigmaBoolean: any;
    messageSeverity: string;
    replyTo: string;
  }> {
    const replyTo = `https://c356-128-119-202-176.ngrok-free.app/ergopay/verify?uuid=${address}`;

    const nonce = await this.nonceService.createNonce(address);
    const nonceWrite = await this.ergoPayService.writeNonce(address, nonce);
    if (!nonceWrite) {
      throw new HttpException(
        'error writing nonce',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const addr = ErgoAddress.fromBase58(address);
    const tree = new ErgoTree(addr.ergoTree);
    const treeBytes = Array.from(tree.toBytes());
    treeBytes.shift();
    treeBytes.shift();
    const sigmaBoolean = Buffer.from(treeBytes).toString('base64');

    return {
      address: address,
      signingMessage: nonce,
      sigmaBoolean: sigmaBoolean,
      userMessage: 'Sign the message to sign in to Lilium',
      messageSeverity: 'INFORMATION',
      replyTo,
    };
  }

  @Post('verify')
  async verify(@Query('uuid') uuid: string, @Body() body: Signature) {
    const result = await this.ergoPayService.writeVerification(uuid, body);
    if (!result) {
      throw new HttpException(
        'error saving verification',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return {
      status: 'SIGNED',
      signedMessage: body.signedMessage,
      proof: body.proof,
    };
  }

  @Get('address/:uuid')
  async getAddress(@Param('uuid') uuid: string): Promise<{ address: string }> {
    const address = await this.ergoPayService.getAddress(uuid);
    if (!address) {
      throw new HttpException(
        'error getting address',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return { address };
  }

  @Get('proof/:uuid')
  async getProof(@Param('uuid') uuid: string): Promise<{ proof: string }> {
    const proof = await this.ergoPayService.getProof(uuid);
    if (!proof) {
      throw new HttpException(
        'error getting proof',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return { proof };
  }

  @Get('nonce/:uuid')
  async getNonce(@Param('uuid') uuid: string): Promise<{ nonce: string }> {
    const nonce = await this.ergoPayService.getNonce(uuid);
    if (!nonce) {
      throw new HttpException(
        'error getting nonce',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return { nonce };
  }

  @Get('reducedTxLink/:uuid/:message/:address')
  async getReducedTxLink(
    @Param('uuid') uuid: string,
    @Param('message') message: string,
    @Param('address') address: string,
  ): Promise<{
    reducedTx: string;
    message: string;
    messageSeverity: string;
    address: string;
  }> {
    const res = await this.ergoPayService.getReducedTxLink(
      uuid,
      message,
      address,
    );
    if (res === 'null') {
      throw new HttpException('An error occurred', HttpStatus.BAD_REQUEST);
    }
    assert(typeof res !== 'string');
    return res;
  }
}
