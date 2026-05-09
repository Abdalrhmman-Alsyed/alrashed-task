import { Module } from '@nestjs/common';
import { AppWebsocketGateway } from './websocket.gateway';
import { WebsocketService } from './websocket.service';

@Module({
  providers: [AppWebsocketGateway, WebsocketService],
  exports: [WebsocketService],
})
export class WebsocketModule {}
