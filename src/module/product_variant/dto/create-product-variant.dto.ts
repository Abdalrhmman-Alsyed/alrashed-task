import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateProductVariantDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  sku!: string;

  @IsNumber()
  price!: number;

  @IsNumber()
  stock_quantity!: number;

  @IsOptional()
  attributes?: any;

  @IsNumber()
  product_id!: number;
}
