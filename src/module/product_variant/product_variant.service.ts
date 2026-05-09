import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProductVariant } from './entity/product_variant.entity';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';

@Injectable()
export class ProductVariantService {
  constructor(
    @InjectRepository(ProductVariant)
    private readonly variantRepository: Repository<ProductVariant>,
  ) {}

  async create(dto: CreateProductVariantDto): Promise<ProductVariant> {
    const variant = this.variantRepository.create({
      sku: dto.sku,
      price: dto.price,
      stock_quantity: dto.stock_quantity,
      attributes: dto.attributes,
      product: { id: dto.product_id },
    });

    return this.variantRepository.save(variant);
  }

  async findAll(): Promise<ProductVariant[]> {
    return this.variantRepository.find({
      relations: ['product', 'orderItems'],
    });
  }

  async findOne(id: number): Promise<ProductVariant> {
    const variant = await this.variantRepository.findOne({
      where: { id },
      relations: ['product', 'orderItems'],
    });

    if (!variant) {
      throw new NotFoundException(`Variant with id ${id} not found`);
    }

    return variant;
  }

  async update(
    id: number,
    dto: UpdateProductVariantDto,
  ): Promise<ProductVariant> {
    const variant = await this.findOne(id);

    Object.assign(variant, dto);

    if (dto.product_id !== undefined) {
      variant.product = { id: dto.product_id } as ProductVariant['product'];
    }

    return this.variantRepository.save(variant);
  }

  async remove(id: number): Promise<{ message: string }> {
    const variant = await this.findOne(id);

    await this.variantRepository.remove(variant);

    return { message: 'Product variant deleted successfully' };
  }
}
