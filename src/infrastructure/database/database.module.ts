import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Company } from './entities/company.entity';
import { User } from './entities/user.entity';
import { DatabaseDataSource } from './database.datasource';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: configService.get('DB_TYPE') as any,
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database:
          configService.get('NODE_ENV') === 'test'
            ? 'challenger-test'
            : (configService.get('DB_DATABASE') as string),
        entities: [Company, User],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [DatabaseDataSource],
  exports: [DatabaseDataSource],
})
export class DatabaseModule {}
