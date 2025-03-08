import { IsString, IsNumber, Length } from 'class-validator';

export class LocationDto {
  @IsString()
  @Length(3, 30)
  address: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}
