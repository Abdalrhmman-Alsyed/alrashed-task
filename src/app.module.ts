import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './common/configuration/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from '././module/user/user.module';
import { AddressModule } from './module/addresse/addresse.module';
import { BrandModule } from './module/brand/brand.module';
import { CategoriesModule } from './module/categorie/categorie.module';
import { NotificationModule } from './module/notification/notification.module';
import { OrderModule } from './module/order/order.module';
import { ProductModule } from './module/product/product.module';
import { OrderItemModule } from './module/order_item/order_item.module';
import { ProductVariantModule } from './module/product_variant/product_variant.module';
import { ReviewModule } from './module/review/review.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    DatabaseModule,
    UsersModule,
    AddressModule,
    BrandModule,
    CategoriesModule,
    NotificationModule,
    OrderModule,
    OrderItemModule,
    ProductModule,
    ProductVariantModule,
    ReviewModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
