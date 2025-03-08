import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Location } from './entities/location.entity';
import { SocialMediaLink } from './entities/social-media-link.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
    @InjectRepository(SocialMediaLink)
    private socialMediaLinkRepository: Repository<SocialMediaLink>,
  ) {}

  // async create(createUserDto: CreateUserDto): Promise<User> {
  //   let location: Location | undefined;
  //   if (createUserDto.location) {
  //     location = this.locationRepository.create({
  //       address: createUserDto.location.address,
  //       latitude: createUserDto.location.latitude,
  //       longitude: createUserDto.location.longitude,
  //     });
  //     await this.locationRepository.save(location);
  //   }

  //   const socialMediaLinks =
  //     createUserDto.socialMediaLinks?.map((link) =>
  //       this.socialMediaLinkRepository.create({
  //         platform: link.platform,
  //         url: link.url,
  //       }),
  //     ) || [];

  //   const user = this.userRepository.create({
  //     ...createUserDto,
  //     location,
  //     socialMediaLinks,
  //   });

  //   return this.userRepository.save(user);
  // }

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.manager.transaction(async (manager) => {
      let location: Location | undefined;
      if (createUserDto.location) {
        location = manager.create(Location, createUserDto.location);
        await manager.save(location);
      }

      const user = manager.create(User, {
        ...createUserDto,
        location,
      });

      await manager.save(user);

      if (createUserDto.socialMediaLinks?.length) {
        const socialMediaLinks = createUserDto.socialMediaLinks.map((link) =>
          manager.create(SocialMediaLink, {
            ...link,
            user,
          }),
        );
        await manager.save(socialMediaLinks);
      }

      return this.findOne(user.id);
    });
  }

  async findAll(
    includeRelations: boolean = true,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ users: User[]; total: number }> {
    const options: any = {
      skip: (page - 1) * limit,
      take: limit,
    };

    if (includeRelations) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      options.relations = ['location', 'socialMediaLinks', 'friends'];
    }

    const [users, total] = await this.userRepository.findAndCount(options);
    return { users, total };
  }

  async findOne(id: number, includeRelations: boolean = true): Promise<User> {
    const options = includeRelations
      ? {
          where: { id },
          relations: ['location', 'socialMediaLinks', 'friends'],
        }
      : { where: { id } };
    const user = await this.userRepository.findOne(options);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  // async findByEmail(
  //   email: string,
  //   includeRelations: boolean = true,
  // ): Promise<User> {
  //   const options = includeRelations
  //     ? {
  //         where: { email },
  //         relations: ['location', 'socialMediaLinks', 'friends'],
  //       }
  //     : { where: { email } };
  //   const user = await this.userRepository.findOne(options);
  //   if (!user) {
  //     throw new NotFoundException(`User with Email ${email} not found`);
  //   }

  //   return user;
  // }

  // async search(
  //   query: string,
  //   page: number = 1,
  //   limit: number = 10,
  // ): Promise<{ users: User[]; total: number }> {
  //   const [users, total] = await this.userRepository
  //     .createQueryBuilder('user')
  //     .where(
  //       'user.firstName ILIKE :query OR user.lastName ILIKE :query OR user.email ILIKE :query',
  //       { query: `%${query}%` },
  //     )
  //     .skip((page - 1) * limit)
  //     .take(limit)
  //     .getManyAndCount();

  //   return { users, total };
  // }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    return this.userRepository.manager.transaction(async (manager) => {
      const user = await this.findOne(id);

      if (updateUserDto.location) {
        if (!user.location) {
          user.location = manager.create(Location, updateUserDto.location);
        } else {
          Object.assign(user.location, updateUserDto.location);
        }
        await manager.save(user.location);
      }

      if (updateUserDto.socialMediaLinks) {
        await manager.delete(SocialMediaLink, { user: { id } });
        const newLinks = updateUserDto.socialMediaLinks.map((link) =>
          manager.create(SocialMediaLink, { ...link, user }),
        );
        await manager.save(newLinks);
      }

      Object.assign(user, updateUserDto);
      await manager.save(user);
      return this.findOne(id);
    });
  }

  async addFriend(userId: number, friendId: number): Promise<User> {
    const user = await this.findOne(userId);
    const friend = await this.findOne(friendId);

    if (user.friends.some((f) => f.id === friendId)) {
      throw new BadRequestException('Users are already friends');
    }

    user.friends.push(friend);
    return this.userRepository.save(user);
  }

  async removeFriend(userId: number, friendId: number): Promise<User> {
    const user = await this.findOne(userId);
    user.friends = user.friends.filter((friend) => friend.id !== friendId);

    return this.userRepository.save(user);
  }

  async removeLocation(id: number): Promise<User> {
    const user = await this.findOne(id);
    if (!user.location) {
      throw new BadRequestException(
        `User with ID ${id} has no location to remove`,
      );
    }
    await this.locationRepository.remove(user.location);
    user.location = null;
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    await this.userRepository.remove(user);
  }
}
