import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';

import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

type SafeUser = Omit<User, 'password_hash'>;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<SafeUser> {
    const exists = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (exists) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await hash(dto.password, 10);

    const user = this.userRepository.create({
      email: dto.email,
      password_hash: hashedPassword,
      role: dto.role ?? 'user',
      is_verified: false,
    });

    const savedUser = await this.userRepository.save(user);
    return this.toSafeUser(savedUser);
  }

  async findAll(): Promise<SafeUser[]> {
    const users = await this.userRepository.find({
      relations: ['address', 'orders', 'reviews', 'notifications'],
    });

    return users.map((user) => this.toSafeUser(user));
  }

  async findOne(id: number): Promise<SafeUser> {
    const user = await this.findOneEntity(id);
    return this.toSafeUser(user);
  }

  private async findOneEntity(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['address', 'orders', 'reviews', 'notifications'],
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async update(id: number, dto: UpdateUserDto): Promise<SafeUser> {
    const user = await this.findOneEntity(id);

    if (dto.email !== undefined) {
      user.email = dto.email;
    }

    if (dto.password !== undefined) {
      user.password_hash = await hash(dto.password, 10);
    }

    if (dto.role !== undefined) {
      user.role = dto.role;
    }

    if (dto.is_verified !== undefined) {
      user.is_verified = dto.is_verified;
    }

    const savedUser = await this.userRepository.save(user);
    return this.toSafeUser(savedUser);
  }

  async remove(id: number): Promise<{ message: string }> {
    const user = await this.findOneEntity(id);

    await this.userRepository.remove(user);

    return { message: 'User deleted successfully' };
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  private toSafeUser(user: User): SafeUser {
    const { password_hash, ...safeUser } = user;
    void password_hash;
    return safeUser;
  }
}
