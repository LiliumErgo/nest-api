import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    description: 'JWT auth token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  authToken: string;
}

export class NonceResponseDto {
  @ApiProperty({
    description: 'Generated nonce value',
    example: '123456',
  })
  nonce: string;
}

export class ErrorResponseDto {
  @ApiProperty({
    description: 'Error message',
    example: 'address verification failed',
  })
  message: string;

  @ApiProperty({
    description: 'HTTP status code',
    example: 401,
  })
  statusCode: number;
}
