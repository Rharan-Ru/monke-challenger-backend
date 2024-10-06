import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../../../application/user/dto/create-user.dto';
import { User } from '../../database/entities/user.entity';
import { DatabaseDataSource } from '../../database/database.datasource';
import { AppModule } from '../../../app.module';
import { HttpExceptionFilter } from '../../../shared/filters/http-exception.filter';

describe('Users (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let token: string;
  let databaseDataSource: DatabaseDataSource;
  let user: User;

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
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/POST user', () => {
    it('should create a new user', async () => {
      const newUser: CreateUserDto = {
        email: 'test@gmail.com',
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

      user = createdUser;

      expect(createdUser).toBeDefined();
      expect(createdUser.email).toEqual(newUser.email);
    });
  });

  describe('/GET user', () => {
    it('should list all users', async () => {
      const response = await request(app.getHttpServer())
        .get('/user')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBeTruthy();
    });

    it('should return a specific user by ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/user/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.id).toEqual(user.id);
      expect(response.body.email).toEqual(user.email);
    });
  });

  describe('/PATCH user/:id', () => {
    it('should update the user data', async () => {
      const updatedUser = {
        email: 'updateduser@test.com',
      };

      await request(app.getHttpServer())
        .patch(`/user/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedUser)
        .expect(200);

      const updatedInDb = await userRepository.findOne({
        where: { id: user.id },
      });
      expect(updatedInDb.email).toEqual(updatedUser.email);
    });
  });

  describe('/DELETE user/:id', () => {
    it('should delete an existing user', async () => {
      await request(app.getHttpServer())
        .delete(`/user/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const deletedUser = await userRepository.findOne({
        where: { id: user.id },
      });

      expect(deletedUser).toBeNull();
    });
  });
});
