import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Signature } from '../../types/signature.dto';

export class LoginRequestDto {
  @ApiProperty({
    description: 'Signature object containing signedMessage and proof',
    type: () => Signature,
  })
  @IsNotEmpty()
  signature: Signature;

  @ApiProperty({
    description: 'Nonce value for verification',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  nonce: string;

  @ApiProperty({
    description: 'Wallet address',
    example: '9f4QF8AD1nQ3nJahQVkMj8hFSVVzVom77b52JU7EW71Zexg6N8',
  })
  @IsString()
  @IsNotEmpty()
  address: string;
}

export class NonceRequestDto {
  @ApiProperty({
    description: 'Wallet address',
    example: '9f4QF8AD1nQ3nJahQVkMj8hFSVVzVom77b52JU7EW71Zexg6N8',
  })
  @IsString()
  @IsNotEmpty()
  address: string;
}
