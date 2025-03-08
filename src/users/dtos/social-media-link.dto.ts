import { IsString, IsUrl, Length } from 'class-validator';

export class SocialMediaLinkDto {
  @IsString()
  @Length(3, 20)
  platform: string;

  @IsString()
  @IsUrl()
  @Length(3, 255)
  url: string;
}
