import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import configuration from './common/configuration/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './module/auth/auth.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { HttpInterceptor } from './common/interceptors/http.interceptor';

import { AddressModule } from './module/addresse/addresse.module';
import { BrandModule } from './module/brand/brand.module';

import { NotificationModule } from './module/notification/notification.module';
import { OrderModule } from './module/order/order.module';
import { ProductModule } from './module/product/product.module';
import { OrderItemModule } from './module/order_item/order_item.module';
import { ProductVariantModule } from './module/product_variant/product_variant.module';
import { ReviewModule } from './module/review/review.module';
import { UserModule } from './module/user/user.module';
import { CategoryModule } from './module/categorie/categorie.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    AddressModule,
    BrandModule,
    CategoryModule,
    NotificationModule,
    OrderModule,
    OrderItemModule,
    ProductModule,
    ProductVariantModule,
    ReviewModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
