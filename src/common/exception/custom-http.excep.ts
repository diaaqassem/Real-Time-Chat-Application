import { HttpException } from '@nestjs/common';

export class CustomHttpException extends HttpException {
  constructor(message: any, statusCode: number) {
    super(message, statusCode);
  }
}
