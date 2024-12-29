import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpException,
  Get,
} from '@nestjs/common';
import { AuthService, Signature } from './auth.service';
import { SupabaseService } from '../supabase/supabase.service';
import { NonceService } from './nonceService';
const jwt = require('jsonwebtoken');

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly supabaseService: SupabaseService,

    private readonly nonceService: NonceService,
  ) {}

  @Post('login')
  async authenticate(
    @Body() body: { signature: Signature; nonce: string; address: string },
  ): Promise<any> {
    const { signature, nonce, address } = body;
    const verificationStatus: boolean = this.authService.verifySignature(
      signature,
      address,
    );
    if (!verificationStatus) {
      console.log('address verification failed');
      throw new HttpException(
        'address verification failed',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const supabase = this.supabaseService.getClient();

    let userData;
    let user;
    try {
      userData = await this.authService.getUserData(supabase, address);
      user = userData.user_id;
    } catch (e) {
      throw new HttpException(
        'error fetching user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (userData.auth.genNonce !== nonce) {
      throw new HttpException('nonce does not match', HttpStatus.UNAUTHORIZED);
    }

    if (!user) {
      try {
        user = await this.authService.createUser(supabase, address);
      } catch (e) {
        throw new HttpException(
          'error creating user',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    try {
      await this.authService.updateUserData(supabase, address, user);
    } catch (e) {
      throw new HttpException(
        'error updating user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const token = jwt.sign(
      {
        address: address, // this will be read by RLS policy
        sub: user.id,
        aud: 'authenticated',
      },
      'my-secret-key',
      { expiresIn: 60 * 2 },
    );

    return {
      authToken: token,
    };
  }

  @Get('hello')
  getHello(): { response: string } {
    return { response: 'hello' };
  }
  @Post('nonce')
  async nonce(@Body() body: { address: string }): Promise<any> {
    const { address } = body;
    const nonce = await this.nonceService.createNonce(address);
    return { nonce };
  }
}
