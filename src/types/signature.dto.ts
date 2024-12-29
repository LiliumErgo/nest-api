import { ApiProperty } from '@nestjs/swagger';

export class Signature {
  @ApiProperty({
    description: 'The signed message',
    type: 'string',
  })
  signedMessage: string;

  @ApiProperty({
    description: 'The proof of the signature',
    type: 'string',
  })
  proof: string;
}
