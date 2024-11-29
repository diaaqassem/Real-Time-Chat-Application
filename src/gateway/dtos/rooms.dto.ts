import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class RoomDto {
  @IsString({
    message: i18nValidationMessage('validation.STR'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validation.NOT_EMPTY'),
  })
  clientID: string;

  @IsNotEmpty({
    message: i18nValidationMessage('validation.NOT_EMPTY'),
  })
  @IsString({
    message: i18nValidationMessage('validation.STR'),
  })
  userID: string;

  @IsString({
    message: i18nValidationMessage('validation.STR'),
  })
  content: string;

  @IsString({
    message: i18nValidationMessage('validation.STR'),
  })
  roomID: string;
}
