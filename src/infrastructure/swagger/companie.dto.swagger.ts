import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CompanyCreateDTO {
  @ApiProperty({
    example: 'Company name',
    default: 'Company1',
    description: 'Company name',
    maxLength: 255,
    minLength: 1,
  })
  @IsString({ message: 'O nome da empresa deve ser uma string.' })
  @Length(1, 255, {
    message: 'O nome da empresa deve ter entre 1 e 255 caracteres.',
  })
  name: string;

  @ApiProperty({
    example: '00.000.000/0000-00',
    default: '00.000.000/0000-00',
    description: 'Company CNPJ',
  })
  @IsString({ message: 'O CNPJ deve ser uma string.' })
  @Length(18, 18, {
    message: 'O CNPJ deve ter 18 caracteres, incluindo formatação.',
  })
  @Matches(/^[0-9]{2}\.[0-9]{3}\.[0-9]{3}\/[0-9]{4}-[0-9]{2}$/, {
    message: 'O CNPJ deve estar no formato 00.000.000/0000-00.',
  })
  CNPJ: string;

  @ApiProperty({
    example: 'Company address',
    default: 'Company address',
    description: 'Company address',
    maxLength: 255,
    minLength: 1,
  })
  @IsString({ message: 'O endereço da empresa deve ser uma string.' })
  @Length(1, 255, {
    message: 'O endereço da empresa deve ter entre 1 e 255 caracteres.',
  })
  address: string;

  @ApiProperty({
    example: 'Company phone',
    default: 'Company phone',
    description: 'Company phone',
  })
  @IsPhoneNumber('BR', {
    message: 'O telefone deve ser um número de telefone válido.',
  })
  phone: string;

  @ApiProperty({
    example: 'example@gmail.com',
    default: 'example@gmail.com',
    description: 'Company email',
  })
  @IsEmail({}, { message: 'O email deve ser um endereço de email válido.' })
  email?: string;
}

export class CompanyUpdateDTO {
  @IsOptional()
  @ApiProperty({
    example: 'Company name',
    default: 'Company1',
    description: 'Company name',
    maxLength: 255,
    minLength: 1,
    required: false,
  })
  @IsString({ message: 'O nome da empresa deve ser uma string.' })
  @Length(1, 255, {
    message: 'O nome da empresa deve ter entre 1 e 255 caracteres.',
  })
  name?: string;

  @IsOptional()
  @ApiProperty({
    example: '00.000.000/0000-00',
    default: '00.000.000/0000-00',
    description: 'Company CNPJ',
    required: false,
  })
  @IsString({ message: 'O CNPJ deve ser uma string.' })
  @Length(18, 18, {
    message: 'O CNPJ deve ter 18 caracteres, incluindo formatação.',
  })
  @Matches(/^[0-9]{2}\.[0-9]{3}\.[0-9]{3}\/[0-9]{4}-[0-9]{2}$/, {
    message: 'O CNPJ deve estar no formato 00.000.000/0000-00.',
  })
  CNPJ?: string;

  @IsOptional()
  @ApiProperty({
    example: 'Company address',
    default: 'Company address',
    description: 'Company address',
    maxLength: 255,
    minLength: 1,
    required: false,
  })
  @IsString({ message: 'O endereço da empresa deve ser uma string.' })
  @Length(1, 255, {
    message: 'O endereço da empresa deve ter entre 1 e 255 caracteres.',
  })
  address?: string;

  @IsOptional()
  @ApiProperty({
    example: 'Company phone',
    default: 'Company phone',
    description: 'Company phone',
    required: false,
  })
  @IsPhoneNumber('BR', {
    message: 'O telefone deve ser um número de telefone válido.',
  })
  phone?: string;

  @IsOptional()
  @ApiProperty({
    example: 'example@gmail.com',
    default: 'example@gmail.com',
    description: 'Company email',
    required: false,
  })
  @IsEmail({}, { message: 'O email deve ser um endereço de email válido.' })
  email?: string;
}
