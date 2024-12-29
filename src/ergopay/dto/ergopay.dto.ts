import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ErgoPayDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Unique identifier',
    example: 'abc123',
  })
  uuid: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Base64 encoded transaction data',
    example: 'ergopay:base64EncodedTransactionData',
  })
  base_64: string;
}

export class ErgoPayResponseDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Generated short UUID',
    example: 'abc123',
  })
  uuid: string;
}
