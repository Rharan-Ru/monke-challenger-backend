import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from '../../infrastructure/controllers/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from '../../infrastructure/database/entities/company.entity';
import { User } from '../../infrastructure/database/entities/user.entity';
import { AuthService } from '../../infrastructure/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Company, User])],
  controllers: [UserController],
  providers: [UserService, AuthService, JwtService],
})
export class UserModule {}
