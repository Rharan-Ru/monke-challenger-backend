import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { Company } from './entities/company.entity';
import { User } from './entities/user.entity';

@Injectable()
export class DatabaseDataSource implements OnModuleInit, OnModuleDestroy {
  private dataSource: DataSource;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    this.dataSource = new DataSource({
      type: this.configService.get('DB_TYPE') as any,
      host: this.configService.get('DB_HOST'),
      port: this.configService.get('DB_PORT'),
      username: this.configService.get('DB_USERNAME'),
      password: this.configService.get('DB_PASSWORD'),
      database:
        this.configService.get('NODE_ENV') === 'test'
          ? 'challenger-test'
          : (this.configService.get('DB_DATABASE') as string),
      entities: [Company, User],
      synchronize: true,
    });

    try {
      await this.dataSource.initialize();
    } catch (error) {
      console.error('Error connecting to the database:', error);
    }
  }

  async onModuleDestroy() {
    if (this.dataSource) {
      await this.dataSource.destroy();
    }
  }

  getDataSource(): DataSource {
    return this.dataSource;
  }
}
