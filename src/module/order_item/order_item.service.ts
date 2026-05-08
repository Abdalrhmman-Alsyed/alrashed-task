import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OrderItem } from './entity/order_item.entity';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async create(dto: CreateOrderItemDto): Promise<OrderItem> {
    const orderItem = this.orderItemRepository.create({
      quantity: dto.quantity,
      unit_price_at_purchase: dto.unit_price_at_purchase,
      order: { id: dto.order_id },
      variant: { id: dto.variant_id },
    });

    return this.orderItemRepository.save(orderItem);
  }

  async findAll(): Promise<OrderItem[]> {
    return this.orderItemRepository.find({
      relations: ['order', 'variant'],
    });
  }

  async findOne(id: number): Promise<OrderItem> {
    const orderItem = await this.orderItemRepository.findOne({
      where: { id },
      relations: ['order', 'variant'],
    });

    if (!orderItem) {
      throw new NotFoundException(`Order item with id ${id} not found`);
    }

    return orderItem;
  }

  async update(id: number, dto: UpdateOrderItemDto): Promise<OrderItem> {
    const orderItem = await this.findOne(id);

    if (dto.quantity !== undefined) {
      orderItem.quantity = dto.quantity;
    }

    if (dto.unit_price_at_purchase !== undefined) {
      orderItem.unit_price_at_purchase = dto.unit_price_at_purchase;
    }

    if (dto.variant_id !== undefined) {
      orderItem.variant = { id: dto.variant_id } as any;
    }

    return this.orderItemRepository.save(orderItem);
  }

  async remove(id: number): Promise<{ message: string }> {
    const orderItem = await this.findOne(id);

    await this.orderItemRepository.remove(orderItem);

    return { message: 'Order item deleted successfully' };
  }
}
