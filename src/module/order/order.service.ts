import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order } from './entity/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async create(dto: CreateOrderDto): Promise<Order> {
    const order = this.orderRepository.create({
      status: dto.status,
      total_amount: dto.total_amount,
      user: { id: dto.user_id },
      address: { id: dto.address_id },
    });

    return this.orderRepository.save(order);
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['user', 'address', 'items'],
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'address', 'items'],
    });

    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    return order;
  }

  async update(id: number, dto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);

    if (dto.status !== undefined) {
      order.status = dto.status;
    }

    if (dto.total_amount !== undefined) {
      order.total_amount = dto.total_amount;
    }

    if (dto.address_id !== undefined) {
      order.address = { id: dto.address_id } as Order['address'];
    }

    return this.orderRepository.save(order);
  }

  async remove(id: number): Promise<{ message: string }> {
    const order = await this.findOne(id);

    await this.orderRepository.remove(order);

    return { message: 'Order deleted successfully' };
  }
}
