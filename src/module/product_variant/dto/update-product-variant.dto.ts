import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateProductVariantDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  sku?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNumber()
  stock_quantity?: number;

  @IsOptional()
  attributes?: any;

  @IsOptional()
  @IsNumber()
  product_id?: number;
}
