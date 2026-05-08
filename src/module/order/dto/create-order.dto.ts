import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  user_id!: number;

  @IsNumber()
  address_id!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  status!: string;

  @IsNumber()
  total_amount!: number;
}
