import { IsNotEmpty, IsString } from 'class-validator';
import mongoose from 'mongoose';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateRoomDto {
  @IsNotEmpty({
    message: i18nValidationMessage('validation.NOT_EMPTY'),
  })
  userID: mongoose.Types.ObjectId;

  @IsString({
    message: i18nValidationMessage('validation.STR'),
  })
  content: string;

  @IsString({
    message: i18nValidationMessage('validation.STR'),
  })
  name: string;
}
