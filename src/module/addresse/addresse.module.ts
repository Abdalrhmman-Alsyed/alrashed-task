import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './entity/addresse.entity';
import { AddressController } from './addresse.controller';
import { AddressService } from './addresse.service';

@Module({
  imports: [TypeOrmModule.forFeature([Address])],
  controllers: [AddressController],
  providers: [AddressService],
  exports: [AddressService],
})
export class AddressModule {}
