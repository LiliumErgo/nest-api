import { Injectable } from '@nestjs/common';
import { Address, verify_signature } from 'ergo-lib-wasm-nodejs';
import { ErgoAddress, Network } from '@fleet-sdk/core';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwt = require('jsonwebtoken');

export interface Signature {
  signedMessage: string;
  proof: string;
}

@Injectable()
export class AuthService {
  private readonly TIMESTAMP: number = 2;
  private readonly ORIGIN: number = 1;

  verifySignature(signature: Signature, address: string): boolean | string {
    try {
      const arr: string[] = signature.signedMessage.split(';');

      if (arr.length !== 4) {
        return false;
      }

      const timestamp = parseInt(arr[this.TIMESTAMP], 10) * 1000;
      const origin = arr[this.ORIGIN];

      const moreThen10SecPassed = timestamp < Date.now() - 1000 * 15;

      if (moreThen10SecPassed) {
        return false;
      }

      const networkAddress =
        ErgoAddress.getNetworkType(address) === Network.Mainnet
          ? Address.from_mainnet_str(address)
          : Address.from_testnet_str(address);

      const isVerified = verify_signature(
        networkAddress,
        Buffer.from(signature.signedMessage, 'utf-8'),
        Buffer.from(signature.proof, 'hex'),
      );

      if (isVerified) {
        return jwt.sign({ address }, '', {
          expiresIn: '10d',
        });
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }
}
