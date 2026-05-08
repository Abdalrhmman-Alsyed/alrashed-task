import { IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateOrderItemDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number;

  @IsOptional()
  @IsNumber()
  unit_price_at_purchase?: number;

  @IsOptional()
  @IsNumber()
  variant_id?: number;
}
