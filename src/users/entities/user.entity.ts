import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Location } from './location.entity';
import { SocialMediaLink } from './social-media-link.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  firstName: string;

  @Column({ length: 50 })
  lastName: string;

  @Column({ length: 50, default: '-' })
  occupation: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ length: 60 })
  password: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  picturePath: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  coverPath: string | null;

  @Column({ default: 0 })
  impressions: number;

  @Column({ default: 0 })
  viewedProfile: number;

  @OneToOne(() => Location, (location) => location.user, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn()
  location: Location | null;

  @OneToMany(() => SocialMediaLink, (social) => social.user, { cascade: true })
  socialMediaLinks: SocialMediaLink[];

  @ManyToMany(() => User, (user) => user.friends, {
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'user_friends',
    joinColumns: [
      {
        name: 'user_id',
        referencedColumnName: 'id',
      },
    ],
    inverseJoinColumns: [
      {
        name: 'friend_id',
        referencedColumnName: 'id',
      },
    ],
  })
  friends: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
