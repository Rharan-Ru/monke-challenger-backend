import { IsString, IsEmail, Matches, Length } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @Length(1, 255)
  name: string;

  @IsString()
  @Matches(/^[0-9]{2}\.[0-9]{3}\.[0-9]{3}\/[0-9]{4}-[0-9]{2}$/)
  CNPJ: string;

  @IsString()
  @Length(1, 255)
  address: string;

  @IsString()
  @Length(1, 255)
  phone: string;

  @IsEmail()
  email?: string;
}
