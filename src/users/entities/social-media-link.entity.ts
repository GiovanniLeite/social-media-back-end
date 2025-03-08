import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('social_media_links')
export class SocialMediaLink {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  platform: string;

  @Column({ length: 255 })
  url: string;

  @ManyToOne(() => User, (user) => user.socialMediaLinks)
  user: User;
}
