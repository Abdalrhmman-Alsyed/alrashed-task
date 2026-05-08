import { IsNumber, Min } from 'class-validator';

export class CreateOrderItemDto {
  @IsNumber()
  order_id!: number;

  @IsNumber()
  variant_id!: number;

  @IsNumber()
  @Min(1)
  quantity!: number;

  @IsNumber()
  unit_price_at_purchase!: number;
}
