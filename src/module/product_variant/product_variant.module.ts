import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductVariantController } from './product_variant.controller';
import { ProductVariantService } from './product_variant.service';
import { ProductVariant } from './entity/product_variant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductVariant])],
  controllers: [ProductVariantController],
  providers: [ProductVariantService],
  exports: [ProductVariantService],
})
export class ProductVariantModule {}
