import { validate } from 'class-validator';
import { UpdateCompanyDto } from '../../../application/companies/dto/update-company.dto';

describe('UpdateCompanyDto', () => {
  it('should validate a valid UpdateCompanyDto', async () => {
    const dto = new UpdateCompanyDto();
    dto.name = 'Valid Company';
    dto.CNPJ = '00.000.000/0000-00';
    dto.address = 'Valid Address';
    dto.phone = '+5511999999999';
    dto.email = 'valid@example.com';

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should invalidate when name is too short', async () => {
    const dto = new UpdateCompanyDto();
    dto.name = '';
    dto.CNPJ = '00.000.000/0000-00';
    dto.address = 'Valid Address';
    dto.phone = '+5511999999999';
    dto.email = 'valid@example.com';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('name');
  });

  it('should invalidate when CNPJ is in an incorrect format', async () => {
    const dto = new UpdateCompanyDto();
    dto.name = 'Valid Company';
    dto.CNPJ = 'Invalid CNPJ';
    dto.address = 'Valid Address';
    dto.phone = '+5511999999999';
    dto.email = 'valid@example.com';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('CNPJ');
  });

  it('should invalidate when email is incorrect', async () => {
    const dto = new UpdateCompanyDto();
    dto.name = 'Valid Company';
    dto.CNPJ = '00.000.000/0000-00';
    dto.address = 'Valid Address';
    dto.phone = '+5511999999999';
    dto.email = 'invalid-email';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('email');
  });
});
