import { Controller, Post, Body } from '@nestjs/common';
import { AuthService, Signature } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async authenticate(
    @Body() body: { signature: Signature; address: string },
  ): Promise<any> {
    const { signature, address } = body;
    const token: string | boolean = await this.authService.verifySignature(
      signature,
      address,
    );
    const status =
      typeof token === 'string'
        ? { status: 'Ok', token, address }
        : { status: 'Reject' };
    return {
      status,
    };
  }
}
