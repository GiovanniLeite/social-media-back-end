import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(
    @Query('includeRelations') includeRelations: string = 'true',
  ): Promise<User[]> {
    const shouldIncludeRelations = includeRelations.toLowerCase() !== 'false';
    return this.usersService.findAll(shouldIncludeRelations);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query('includeRelations') includeRelations: string = 'true',
  ): Promise<User> {
    const shouldIncludeRelations = includeRelations.toLowerCase() !== 'false';
    return this.usersService.findOne(+id, shouldIncludeRelations);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id/location')
  removeLocation(@Param('id') id: string): Promise<User> {
    return this.usersService.removeLocation(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(+id);
  }
}
