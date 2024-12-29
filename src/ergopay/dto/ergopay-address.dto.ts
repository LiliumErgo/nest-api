import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsObject, IsOptional } from 'class-validator';
import { Signature } from 'src/types/signature.dto';

export class ErgoPayAddressDto {
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
    description: 'Ergo Address',
    example: '9f4QF8AD1nQ3nJahQVkMj8hFSVVzVom77b52JU7EW71Zexg6N8',
  })
  address: string;

  @IsOptional()
  @IsObject()
  @ApiProperty({
    description: 'Verification signature object',
    type: () => Signature,
  })
  verification?: Signature;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Nonce value for verification',
    example: 'randomNonceString',
  })
  nonce?: string;
}

export class ErgoPayAddressResponseDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Generated UUID',
    example: '704abfc6-dc0b-45cd-a305-f8bc879d1365',
  })
  uuid: string;
}

export class ErgoPayVerificationDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'UUID for the address',
    example: '704abfc6-dc0b-45cd-a305-f8bc879d1365',
  })
  uuid: string;

  @IsNotEmpty()
  @IsObject()
  @ApiProperty({
    description: 'Verification signature object',
    type: () => Signature,
  })
  verification: Signature;
}

export class ErgoPayNonceDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'UUID for the address',
    example: 'abc123',
  })
  uuid: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Nonce value',
    example: 'randomNonceString',
  })
  nonce: string;
}
