import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ReducedTxLinkResponse {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Reduced transaction data',
    example: 'base64EncodedReducedTx',
  })
  reducedTx: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Message to display to the user',
    example: 'Transaction created successfully',
  })
  message: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Severity level of the message',
    example: 'INFORMATION',
  })
  messageSeverity: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Ergo address',
    example: '9f4QF8AD1nQ3nJahQVkMj8hFSVVzVom77b52JU7EW71Zexg6N8',
  })
  address: string;
}

export class ErgoPayAuthResponse {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Message to display to the user',
    example: 'Sign the message to sign in to Lilium',
  })
  userMessage: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Ergo address',
    example: '9f4QF8AD1nQ3nJahQVkMj8hFSVVzVom77b52JU7EW71Zexg6N8',
  })
  address: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Message to be signed',
    example: 'randomNonceString',
  })
  signingMessage: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Sigma boolean for verification',
    example: 'sigmaProp',
  })
  sigmaBoolean: any;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Severity level of the message',
    example: 'INFORMATION',
  })
  messageSeverity: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Reply-to endpoint',
    example: 'http://localhost:4000/ergopay/verify',
  })
  replyTo: string;
}

export class ErgoPayVerificationResponse {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Status of the verification',
    example: 'SIGNED',
    enum: ['SIGNED'],
  })
  status: 'SIGNED';

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The signed message',
    example: 'signedMessageData',
  })
  signedMessage: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Proof of signing',
    example: 'proofData',
  })
  proof: string;
}
