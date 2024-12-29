import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SupabaseService } from '../supabase/supabase.service';
import { NonceService } from './nonceService';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import {
  ErrorResponseDto,
  LoginResponseDto,
  NonceResponseDto,
} from './dto/auth-response.dto';
import { LoginRequestDto, NonceRequestDto } from './dto/auth-request.dto';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwt = require('jsonwebtoken');

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly supabaseService: SupabaseService,
    private readonly nonceService: NonceService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Authenticate user with signature' })
  @ApiResponse({
    status: 200,
    description: 'User successfully authenticated',
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid signature or nonce',
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ErrorResponseDto,
  })
  async authenticate(@Body() body: LoginRequestDto): Promise<LoginResponseDto> {
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

  @Post('nonce')
  @ApiOperation({ summary: 'Generate nonce for wallet address' })
  @ApiResponse({
    status: 200,
    description: 'Nonce successfully generated',
    type: NonceResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Error generating nonce',
    type: ErrorResponseDto,
  })
  async nonce(@Body() body: NonceRequestDto): Promise<NonceResponseDto> {
    const { address } = body;
    const nonce = await this.nonceService.createNonce(address);
    return { nonce };
  }
}
