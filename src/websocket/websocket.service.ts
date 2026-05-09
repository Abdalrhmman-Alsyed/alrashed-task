import { Injectable } from '@nestjs/common';
import { Notification } from '../module/notification/entity/notification.entity';
import { AppWebsocketGateway } from './websocket.gateway';

@Injectable()
export class WebsocketService {
  constructor(private readonly websocketGateway: AppWebsocketGateway) {}

  emitNotificationCreated(notification: Notification): void {
    this.websocketGateway.emitToUser(
      notification.user.id,
      'notification_created',
      notification,
    );
  }

  emitNotificationUpdated(notification: Notification): void {
    this.websocketGateway.emitToUser(
      notification.user.id,
      'notification_updated',
      notification,
    );
  }

  emitNotificationDeleted(notificationId: number, userId: number): void {
    this.websocketGateway.emitToUser(userId, 'notification_deleted', {
      id: notificationId,
    });
  }
}
