import {
  IsString,
  IsEmail,
  IsOptional,
  ValidateNested,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { SocialMediaLinkDto } from './social-media-link.dto';
import { LocationDto } from './location.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @IsOptional()
  @Length(3, 30)
  firstName?: string;

  @IsString()
  @IsOptional()
  @Length(3, 30)
  lastName?: string;

  @IsString()
  @IsOptional()
  @Length(3, 30)
  occupation?: string;

  @IsEmail()
  @IsOptional()
  @Length(1, 255)
  email?: string;

  @IsString()
  @IsOptional()
  @Length(8, 60)
  password?: string;

  @IsString()
  @IsOptional()
  @Length(1, 255)
  picturePath?: string;

  @IsString()
  @IsOptional()
  @Length(1, 255)
  coverPath?: string;

  @ValidateNested()
  @Type(() => LocationDto)
  @IsOptional()
  location?: LocationDto;

  @ValidateNested({ each: true })
  @Type(() => SocialMediaLinkDto)
  @IsOptional()
  socialMediaLinks?: SocialMediaLinkDto[];
}
