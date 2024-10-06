import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CompaniesService } from '../../../../src/application/companies/companies.service';
import { CreateCompanyDto } from '../../../../src/application/companies/dto/create-company.dto';
import { UpdateCompanyDto } from '../../../../src/application/companies/dto/update-company.dto';
import { Company } from '../../../../src/infrastructure/database/entities/company.entity';
import { Repository } from 'typeorm';
import { CustomError } from '../../../../src/shared/utils/error.custom';

describe('CompaniesService', () => {
  let service: CompaniesService;
  let repository: Repository<Company>;

  const mockCompany = {
    id: 1,
    name: 'Company1',
    CNPJ: '00.000.000/0000-00',
    address: 'Company address',
    phone: '+5511999999999',
    email: 'example@gmail.com',
    user: { id: 1 },
  };

  const mockCompanyCreateDTO: CreateCompanyDto = {
    name: 'Company1',
    CNPJ: '00.000.000/0000-00',
    address: 'Company address',
    phone: '+5511999999999',
    email: 'example@gmail.com',
  };

  const mockCompanyUpdateDTO: UpdateCompanyDto = {
    name: 'Updated Company',
    CNPJ: '11.111.111/1111-11',
    address: 'Updated address',
    phone: '+5511988888888',
    email: 'updated@gmail.com',
  };

  const mockRepository = {
    create: jest.fn().mockReturnValue(mockCompany),
    save: jest.fn().mockResolvedValue(mockCompany),
    find: jest.fn().mockResolvedValue([mockCompany]),
    findOne: jest.fn().mockResolvedValue(mockCompany),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesService,
        {
          provide: getRepositoryToken(Company),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CompaniesService>(CompaniesService);
    repository = module.get<Repository<Company>>(getRepositoryToken(Company));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new company', async () => {
      const result = await service.create(mockCompanyCreateDTO, 1);
      expect(repository.create).toHaveBeenCalledWith({
        ...mockCompanyCreateDTO,
        user: { id: 1 },
      });
      expect(repository.save).toHaveBeenCalledWith(mockCompany);
      expect(result).toEqual(mockCompany);
    });
  });

  describe('findAll', () => {
    it('should return an array of companies', async () => {
      const result = await service.findAll(1);
      expect(repository.find).toHaveBeenCalledWith({
        where: { user: { id: 1 } },
      });
      expect(result).toEqual([mockCompany]);
    });
  });

  describe('findOne', () => {
    it('should return a single company', async () => {
      const result = await service.findOne(1, 1);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1, user: { id: 1 } },
      });
      expect(result).toEqual(mockCompany);
    });

    it('should throw an error if company is not found', async () => {
      (repository.findOne as jest.Mock).mockResolvedValueOnce(null);
      await expect(service.findOne(1, 1)).rejects.toThrow(CustomError);
    });
  });

  describe('update', () => {
    it('should update a company', async () => {
      const result = await service.update(1, mockCompanyUpdateDTO, 1);
      expect(repository.update).toHaveBeenCalledWith(1, {
        ...mockCompanyUpdateDTO,
        user: { id: 1 },
      });
      expect(result).toEqual({ affected: 1 });
    });
  });

  describe('remove', () => {
    it('should delete a company', async () => {
      const result = await service.remove(1, 1);
      expect(repository.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual({ affected: 1 });
    });

    it('should throw an error if company is not found during removal', async () => {
      (repository.findOne as jest.Mock).mockResolvedValueOnce(null);
      await expect(service.remove(1, 1)).rejects.toThrow(CustomError);
    });
  });
});
