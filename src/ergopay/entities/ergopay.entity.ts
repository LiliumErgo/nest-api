import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('ergopay')
export class ErgoPay {
  @PrimaryColumn()
  uuid: string;

  @Column()
  base_64: string;
}
