// nestJs module
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// DTOs
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
// Entities
import { Company } from '../../infrastructure/database/entities/company.entity';
import { CustomError } from '../../shared/utils/error.custom';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto, userId: number) {
    const companyExists = await this.companyRepository.findOne({
      where: { name: createCompanyDto.name },
    });

    if (companyExists) {
      throw new CustomError('Company already exists', 400);
    }

    const company = this.companyRepository.create({
      ...createCompanyDto,
      user: { id: userId },
    });
    return await this.companyRepository.save(company);
  }

  async findAll(userId: number) {
    return await this.companyRepository.find({
      where: { user: { id: userId } },
    });
  }

  async findOne(id: number, userId: number) {
    const company = await this.companyRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!company) {
      throw new CustomError('Company not found', 404);
    }
    return company;
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto, userId: number) {
    return await this.companyRepository.update(id, {
      ...updateCompanyDto,
      user: { id: userId },
    });
  }

  async remove(id: number, userId: number) {
    const company = await this.findOne(id, userId);
    if (!company) {
      throw new CustomError('User not found', 404);
    }
    return await this.companyRepository.delete(id);
  }
}
