import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateAddressDto {
  @IsNumber()
  user_id!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  type!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  street!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  city!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  state!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  zip_code!: string;
}
