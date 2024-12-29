import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'node:crypto';
import { ErgoAddress } from '@fleet-sdk/core';
import { Signature } from 'src/types/signature.dto';
import { ErgoPay } from './entities/ergopay.entity';
import { ErgoPayAddress } from './entities/ergopay-address.entity';
import { ReducedTxLinkResponse } from 'src/types/ergopay.dto';

@Injectable()
export class ErgoPayService {
  constructor(
    @InjectRepository(ErgoPay)
    private readonly ergoPayRepository: Repository<ErgoPay>,
    @InjectRepository(ErgoPayAddress)
    private readonly ergoPayAddressRepository: Repository<ErgoPayAddress>,
  ) {}

  async generateErgoPayShortLink(base64Txn: string): Promise<string> {
    try {
      const uuid = randomUUID().substring(0, 6);
      const ergoPay = this.ergoPayRepository.create({
        uuid,
        base_64: `ergopay:${base64Txn}`,
      });
      await this.ergoPayRepository.save(ergoPay);
      return uuid;
    } catch (error) {
      console.log(error);
      return 'null';
    }
  }

  async createAddressLink(uuid: string, address: string): Promise<string> {
    if (!ErgoAddress.validate(address)) {
      return 'null';
    }
    try {
      const ergoPayAddress = this.ergoPayAddressRepository.create({
        uuid,
        address,
      });
      await this.ergoPayAddressRepository.save(ergoPayAddress);
      return uuid;
    } catch (error) {
      return 'null';
    }
  }

  async writeVerification(
    uuid: string,
    verification: Signature,
  ): Promise<boolean> {
    try {
      await this.ergoPayAddressRepository.update({ uuid }, { verification });
      return true;
    } catch (error) {
      return false;
    }
  }

  async writeNonce(uuid: string, nonce: string): Promise<boolean> {
    try {
      await this.ergoPayAddressRepository.update({ uuid }, { nonce });
      return true;
    } catch (error) {
      return false;
    }
  }

  async getAddress(uuid: string): Promise<string | undefined> {
    try {
      const result = await this.ergoPayAddressRepository.findOne({
        where: { uuid },
      });
      return result?.address;
    } catch (error) {
      return undefined;
    }
  }

  async getProof(uuid: string): Promise<string | undefined> {
    try {
      const result = await this.ergoPayAddressRepository.findOne({
        where: { uuid },
      });
      return result?.verification?.proof;
    } catch (error) {
      return undefined;
    }
  }

  async getNonce(uuid: string): Promise<string | undefined> {
    try {
      const result = await this.ergoPayAddressRepository.findOne({
        where: { uuid },
      });
      return result?.nonce;
    } catch (error) {
      return undefined;
    }
  }

  async getReducedTxLink(
    uuid: string,
    message: string,
    address: string,
  ): Promise<ReducedTxLinkResponse | string> {
    try {
      const result = await this.ergoPayRepository.findOne({ where: { uuid } });
      if (!result) return 'null';

      const reducedTx = result.base_64.slice(8);
      return {
        reducedTx,
        message,
        messageSeverity: 'INFORMATION',
        address,
      };
    } catch (error) {
      return 'null';
    }
  }
}
