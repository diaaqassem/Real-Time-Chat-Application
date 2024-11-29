import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class GoogleDto {
  @IsString({
    message: i18nValidationMessage('validation.STR'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.NOT_EMPTY'),
  })
  name: string;

  @IsNotEmpty({
    message: i18nValidationMessage('validation.NOT_EMPTY'),
  })
  @IsString({
    message: i18nValidationMessage('validation.STR'),
  })
  @IsEmail(
    {},
    {
      message: i18nValidationMessage('validation.EMAIL'),
    },
  )
  email: string;

  @IsString()
  @IsOptional()
  provider?: string;
}
