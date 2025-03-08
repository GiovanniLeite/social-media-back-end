import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  address: string;

  @Column('float')
  latitude: number;

  @Column('float')
  longitude: number;

  @OneToOne(() => User, (user) => user.location)
  user: User;
}
