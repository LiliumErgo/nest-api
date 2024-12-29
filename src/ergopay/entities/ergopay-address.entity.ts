import { Entity, Column, PrimaryColumn } from 'typeorm';
import { Signature } from 'src/types/signature.dto';

@Entity('ergopay_address')
export class ErgoPayAddress {
  @PrimaryColumn()
  uuid: string;

  @Column()
  address: string;

  @Column('jsonb', { nullable: true })
  verification: Signature;

  @Column({ nullable: true })
  nonce: string;
}
