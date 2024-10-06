import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from '../../infrastructure/controllers/companies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from '../../infrastructure/database/entities/company.entity';
import { User } from '../../infrastructure/database/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Company, User])],
  controllers: [CompaniesController],
  providers: [CompaniesService],
})
export class CompaniesModule {}
