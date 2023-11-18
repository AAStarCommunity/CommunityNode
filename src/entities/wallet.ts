import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('wallet')
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'address', nullable: true })
  address?: string;
  @Column({ name: 'phone', nullable: true })
  phone?: string;
  @Column({ name: 'certificate', nullable: true })
  certificate?: string;
  @Column({ name: 'password', nullable: true })
  password?: string;
}
