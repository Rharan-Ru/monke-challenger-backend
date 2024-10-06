import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, unique: true })
  name: string;

  @Column({ length: 255 })
  CNPJ: string;

  @Column({ length: 255 })
  address: string;

  @Column({ length: 255 })
  phone: string;

  @Column({ length: 255 })
  email: string;

  @ManyToOne(() => User, (company) => company.company, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;
}
