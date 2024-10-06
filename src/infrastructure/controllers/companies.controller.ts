import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CompaniesService } from '../../application/companies/companies.service';
import { IAuthRequestUser } from '../auth/auth.interfaces';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  HttpException,
} from '@nestjs/common';
import {
  CompanyCreateDTO,
  CompanyUpdateDTO,
} from '../swagger/companie.dto.swagger';

@ApiTags('companies')
@ApiBearerAuth()
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @ApiConsumes('application/x-www-form-urlencoded')
  async create(
    @Body() createCompanyDto: CompanyCreateDTO,
    @Request() req: { user: IAuthRequestUser },
  ) {
    try {
      const userId = req.user.userId;
      return await this.companiesService.create(createCompanyDto, +userId);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get()
  async findAll(@Request() req: { user: IAuthRequestUser }) {
    try {
      const userId = req.user.userId;
      return await this.companiesService.findAll(+userId);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Request() req: { user: IAuthRequestUser },
  ) {
    try {
      const userId = req.user.userId;
      const companie = await this.companiesService.findOne(+id, +userId);
      return companie;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Patch(':id')
  @ApiConsumes('application/x-www-form-urlencoded')
  async update(
    @Param('id') id: string,
    @Body() updateCompanyDto: CompanyUpdateDTO,
    @Request() req: { user: IAuthRequestUser },
  ) {
    try {
      const userId = req.user.userId;
      return await this.companiesService.update(+id, updateCompanyDto, +userId);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Request() req: { user: IAuthRequestUser },
  ) {
    try {
      const userId = req.user.userId;
      return await this.companiesService.remove(+id, +userId);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
