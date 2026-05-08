import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entity/addresse.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  async create(createAddressDto: CreateAddressDto): Promise<Address> {
    const address = this.addressRepository.create({
      type: createAddressDto.type,
      street: createAddressDto.street,
      city: createAddressDto.city,
      state: createAddressDto.state,
      zip_code: createAddressDto.zip_code,
      user: { id: createAddressDto.user_id },
    });

    return this.addressRepository.save(address);
  }

  async findAll(): Promise<Address[]> {
    return this.addressRepository.find({
      relations: ['user', 'orders'],
    });
  }

  async findOne(id: number): Promise<Address> {
    const address = await this.addressRepository.findOne({
      where: { id },
      relations: ['user', 'orders'],
    });

    if (!address) {
      throw new NotFoundException(`Address with id ${id} not found`);
    }

    return address;
  }

  async update(
    id: number,
    updateAddressDto: UpdateAddressDto,
  ): Promise<Address> {
    const address = await this.findOne(id);

    Object.assign(address, updateAddressDto);

    return this.addressRepository.save(address);
  }

  async remove(id: number): Promise<{ message: string }> {
    const address = await this.findOne(id);

    await this.addressRepository.remove(address);

    return { message: 'Address deleted successfully' };
  }
}
