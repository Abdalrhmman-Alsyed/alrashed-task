import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Notification } from './entity/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { WebsocketService } from '../../websocket/websocket.service';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly websocketService: WebsocketService,
  ) {}

  async create(dto: CreateNotificationDto): Promise<Notification> {
    const notification = this.notificationRepository.create({
      title: dto.title,
      message: dto.message,
      type: dto.type,
      is_read: dto.is_read ?? false,
      user: { id: dto.user_id },
    });

    const saved = await this.notificationRepository.save(notification);
    const withUser = await this.findOne(saved.id);
    this.websocketService.emitNotificationCreated(withUser);
    return withUser;
  }

  async findAll(): Promise<Notification[]> {
    return this.notificationRepository.find({
      relations: ['user'],
    });
  }

  async findOne(id: number): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!notification) {
      throw new NotFoundException(`Notification with id ${id} not found`);
    }

    return notification;
  }

  async update(id: number, dto: UpdateNotificationDto): Promise<Notification> {
    const notification = await this.findOne(id);

    Object.assign(notification, dto);
    const saved = await this.notificationRepository.save(notification);
    const withUser = await this.findOne(saved.id);
    this.websocketService.emitNotificationUpdated(withUser);
    return withUser;
  }

  async remove(id: number): Promise<{ message: string }> {
    const notification = await this.findOne(id);

    const userId = notification.user.id;
    await this.notificationRepository.remove(notification);
    this.websocketService.emitNotificationDeleted(id, userId);

    return { message: 'Notification deleted successfully' };
  }
}
