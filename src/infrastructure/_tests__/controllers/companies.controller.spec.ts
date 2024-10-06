import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Company } from '../../database/entities/company.entity';
import { CreateCompanyDto } from '../../../application/companies/dto/create-company.dto';
import { AppModule } from '../../../app.module';
import { DatabaseDataSource } from '../../database/database.datasource';
import { HttpExceptionFilter } from '../../../shared/filters/http-exception.filter';
import { User } from '../../database/entities/user.entity';

describe('Companies (e2e)', () => {
  let app: INestApplication;
  let companyRepository: Repository<Company>;
  let userRepository: Repository<User>;
  let token: string;
  let databaseDataSource: DatabaseDataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());

    await app.init();

    databaseDataSource =
      moduleFixture.get<DatabaseDataSource>(DatabaseDataSource);
    await databaseDataSource.onModuleInit();

    companyRepository =
      moduleFixture.get<Repository<Company>>('CompanyRepository');

    userRepository = moduleFixture.get<Repository<User>>('UserRepository');
  });

  afterAll(async () => {
    await companyRepository.clear();
    await userRepository.delete({
      email: 'test_companies@gmail.com',
    });
    await app.close();
  });

  describe('/POST user', () => {
    it('should create a new user', async () => {
      const newUser = {
        email: 'test_companies@gmail.com',
        password: 'challenger',
      };

      const response = await request(app.getHttpServer())
        .post('/user')
        .send(newUser)
        .expect(201);

      expect(response.body).toHaveProperty('token');

      token = response.body.token;

      const createdUser = await userRepository.findOne({
        where: { email: newUser.email },
      });

      expect(createdUser).toBeDefined();
      expect(createdUser.email).toEqual(newUser.email);
    });
  });

  describe('/POST companies', () => {
    it('should create a new company', async () => {
      const company: CreateCompanyDto = {
        name: 'Company Test 1',
        CNPJ: '00.000.000/0000-00',
        address: 'Rua Teste, 123',
        phone: '+5511999999999',
        email: 'test@example.com',
      };

      const response = await request(app.getHttpServer())
        .post('/companies')
        .set('Authorization', `Bearer ${token}`)
        .send(company)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toEqual(company.name);

      const createdCompany = await companyRepository.findOne({
        where: { CNPJ: company.CNPJ },
      });
      expect(createdCompany).toBeDefined();
      expect(createdCompany.name).toEqual(company.name);
    });

    it('should return validation error when trying to create a company with invalid CNPJ', async () => {
      const invalidCompany: CreateCompanyDto = {
        name: 'Invalid Company',
        CNPJ: '123',
        address: 'Rua Teste, 123',
        phone: '+5511999999999',
        email: 'invalid@example.com',
      };

      const response = await request(app.getHttpServer())
        .post('/companies')
        .send(invalidCompany)
        .set('Authorization', `Bearer ${token}`);

      const bodyExpected = {
        message: {
          message: [
            'O CNPJ deve estar no formato 00.000.000/0000-00.',
            'O CNPJ deve ter 18 caracteres, incluindo formatação.',
          ],
          error: 'Bad Request',
          statusCode: 400,
        },
      };

      expect(response.body.message).toEqual(bodyExpected.message);
    });
  });

  describe('/GET companies', () => {
    it('should list all companies', async () => {
      const response = await request(app.getHttpServer())
        .get('/companies')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBeTruthy();
    });

    it('should return a specific company by ID', async () => {
      const company: CreateCompanyDto = {
        name: 'Company Test 2',
        CNPJ: '00.000.000/0000-00',
        address: 'Rua Teste, 123',
        phone: '+5511999999999',
        email: 'test@example.com',
      };

      const createdCompanyResponse = await request(app.getHttpServer())
        .post('/companies')
        .set('Authorization', `Bearer ${token}`)
        .send(company)
        .expect(201);

      const companyData = createdCompanyResponse.body;

      const response = await request(app.getHttpServer())
        .get(`/companies/${companyData.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.id).toEqual(companyData.id);
      expect(response.body.name).toEqual(companyData.name);
    });
  });

  describe('/PATCH companies/:id', () => {
    it('should update the data of a company', async () => {
      const company: CreateCompanyDto = {
        name: 'Company Test 3',
        CNPJ: '00.000.000/0000-00',
        address: 'Rua Teste, 123',
        phone: '+5511999999999',
        email: 'test@example.com',
      };

      const createdCompanyResponse = await request(app.getHttpServer())
        .post('/companies')
        .set('Authorization', `Bearer ${token}`)
        .send(company)
        .expect(201);

      const companyData = createdCompanyResponse.body;

      const updatedCompany = {
        name: 'Company Patch',
      };

      await request(app.getHttpServer())
        .patch(`/companies/${companyData.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedCompany)
        .expect(200);

      const updatedInDb = await companyRepository.findOne({
        where: { id: companyData.id },
      });
      expect(updatedInDb.name).toEqual(updatedCompany.name);
    });
  });

  describe('/DELETE companies/:id', () => {
    it('should delete an existing company', async () => {
      const company: CreateCompanyDto = {
        name: 'Company Test 4',
        CNPJ: '00.000.000/0000-00',
        address: 'Rua Teste, 123',
        phone: '+5511999999999',
        email: 'test@example.com',
      };

      const createdCompanyResponse = await request(app.getHttpServer())
        .post('/companies')
        .set('Authorization', `Bearer ${token}`)
        .send(company)
        .expect(201);

      const companyData = createdCompanyResponse.body;

      await request(app.getHttpServer())
        .delete(`/companies/${companyData.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const deletedCompany = await companyRepository.findOne({
        where: { id: companyData.id },
      });

      expect(deletedCompany).toBeNull();
    });
  });
});
