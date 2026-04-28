import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandController } from './brand.controller';
import { BrandsService } from './brand.service';
import { Brand } from './entity/brand.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Brand])],
  controllers: [BrandController],
  providers: [BrandsService],
  exports: [BrandsService],
})
export class BrandModule {}
