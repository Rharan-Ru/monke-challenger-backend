// nestJs module
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
// nestJs controllers/services
import { AppController } from './app.controller';
import { AppService } from './app.service';
// nestJs application modules
import { CompaniesModule } from './application/companies/companies.module';
import { UserModule } from './application/user/user.module';
import { AuthModule } from './infrastructure/auth/auth.module';
import { JwtAuthGuard } from './infrastructure/auth/jwt-auth.guard';
import { DatabaseModule } from './infrastructure/database/database.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CompaniesModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
