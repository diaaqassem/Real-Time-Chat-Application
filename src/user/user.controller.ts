import { Controller, Get } from '@nestjs/common';

@Controller('user')
export class UserController {
  @Get('/user-data')
  getUserData() {
    return `This is user data`;
  }
}
