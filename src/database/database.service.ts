import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseService {
  constructor(private readonly dataSource: DataSource) {}

  isInitialized(): boolean {
    return this.dataSource.isInitialized;
  }
}
