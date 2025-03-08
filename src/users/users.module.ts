import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { Location } from './entities/location.entity';
import { SocialMediaLink } from './entities/social-media-link.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Location, SocialMediaLink])],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
