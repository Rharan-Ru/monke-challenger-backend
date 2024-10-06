import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { DatabaseDataSource } from '../../database/database.datasource';
import { AppModule } from '../../../app.module';
import { HttpExceptionFilter } from '../../../shared/filters/http-exception.filter';
import { AuthLoginDTO } from '../../../../src/infrastructure/swagger/auth.dto.swagger';

describe('Auth (e2e)', () => {
  let app: INestApplication;
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

    userRepository = moduleFixture.get<Repository<User>>('UserRepository');

    const createdUser = userRepository.create({
      email: 'testuser@example.com',
      password: 'hashedpassword',
    });

    await userRepository.save(createdUser);
  });

  afterAll(async () => {
    await userRepository.delete({ email: 'testuser@example.com' });
    await app.close();
  });

  describe('/POST auth/login', () => {
    it('should login with valid credentials', async () => {
      const validLoginDto: AuthLoginDTO = {
        email: 'testuser@example.com',
        password: 'hashedpassword',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(validLoginDto)
        .expect(201);

      expect(response.body).toHaveProperty('access_token');
      token = response.body.access_token;

      expect(token).toBeDefined();
    });

    it('should return 401 with invalid credentials', async () => {
      const invalidLoginDto: AuthLoginDTO = {
        email: 'testuser@example.com',
        password: 'invalidpassword',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(invalidLoginDto)
        .expect(401);

      expect(response.body.message).toBe('Invalid credentials');
    });
  });
});
