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
import { Signature } from 'src/types/signature.dto';
import { ConfigService } from '@nestjs/config';
import {
  ReducedTxLinkResponse,
  ErgoPayAuthResponse,
  ErgoPayVerificationResponse,
} from 'src/types/ergopay.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiParam,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { ErgoPayResponseDto } from './dto/ergopay.dto';

@ApiTags('ErgoPay')
@Controller('ergopay')
export class ErgoPayController {
  constructor(
    private readonly ergoPayService: ErgoPayService,
    private readonly nonceService: NonceService,
    private readonly configService: ConfigService,
  ) {}

  @Get('generateShortLink/:base64Data')
  @ApiOperation({ summary: 'Generate a short link for ErgoPay transaction' })
  @ApiParam({
    name: 'base64Data',
    description: 'Base64 encoded transaction data',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Short link generated successfully',
    type: ErgoPayResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Error generating short link',
  })
  async generateShortLink(
    @Param('base64Data') base64Data: string,
  ): Promise<{ shortCode: string }> {
    const shortCode = await this.ergoPayService.generateErgoPayShortLink(
      base64Data,
    );
    return { shortCode: shortCode };
  }

  @Get('generateAddressLink/:uuid/:address')
  @ApiOperation({ summary: 'Generate address link for ErgoPay' })
  @ApiParam({
    name: 'uuid',
    description: 'Unique identifier',
    required: true,
  })
  @ApiParam({
    name: 'address',
    description: 'Ergo address',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Address link generated successfully',
    schema: {
      properties: {
        message: {
          type: 'string',
          example: 'successfully connected',
        },
      },
    },
  })
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
  @ApiOperation({ summary: 'Initiate ErgoPay authentication' })
  @ApiParam({
    name: 'address',
    description: 'Ergo address to authenticate',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Authentication initiated successfully',
    type: ErgoPayAuthResponse,
  })
  @ApiInternalServerErrorResponse({
    description: 'Error writing nonce',
  })
  async auth(@Param('address') address: string): Promise<ErgoPayAuthResponse> {
    const apiUrl = this.configService.get<string>('API_URL');
    const replyTo = `${apiUrl}/ergopay/verify?uuid=${address}`;

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
  @ApiOperation({ summary: 'Verify ErgoPay signature' })
  @ApiQuery({
    name: 'uuid',
    description: 'Unique identifier',
    required: true,
  })
  @ApiBody({ type: Signature })
  @ApiResponse({
    status: 200,
    description: 'Signature verified successfully',
    type: ErgoPayVerificationResponse,
  })
  @ApiInternalServerErrorResponse({
    description: 'Error saving verification',
  })
  async verify(
    @Query('uuid') uuid: string,
    @Body() body: Signature,
  ): Promise<ErgoPayVerificationResponse> {
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
  @ApiOperation({ summary: 'Get address for UUID' })
  @ApiParam({
    name: 'uuid',
    description: 'Unique identifier',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Address retrieved successfully',
    schema: {
      properties: {
        address: {
          type: 'string',
          example: '9f4QF8AD1nQ3nJahQVkMj8hFSVVzVom77b52JU7EW71Zexg6N8',
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Error getting address',
  })
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
  @ApiOperation({ summary: 'Get proof for UUID' })
  @ApiParam({
    name: 'uuid',
    description: 'Unique identifier',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Proof retrieved successfully',
    schema: {
      properties: {
        proof: {
          type: 'string',
          example: 'proofString',
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Error getting proof',
  })
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
  @ApiOperation({ summary: 'Get nonce for UUID' })
  @ApiParam({
    name: 'uuid',
    description: 'Unique identifier',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Nonce retrieved successfully',
    schema: {
      properties: {
        nonce: {
          type: 'string',
          example: 'randomNonceString',
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Error getting nonce',
  })
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
  @ApiOperation({ summary: 'Get reduced transaction link' })
  @ApiParam({
    name: 'uuid',
    description: 'Unique identifier',
    required: true,
  })
  @ApiParam({
    name: 'message',
    description: 'Transaction message',
    required: true,
  })
  @ApiParam({
    name: 'address',
    description: 'Ergo address',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Reduced transaction link retrieved successfully',
    type: ReducedTxLinkResponse,
  })
  @ApiBadRequestResponse({
    description: 'An error occurred',
  })
  async getReducedTxLink(
    @Param('uuid') uuid: string,
    @Param('message') message: string,
    @Param('address') address: string,
  ): Promise<ReducedTxLinkResponse> {
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
