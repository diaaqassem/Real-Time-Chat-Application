import { Inject, Injectable, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import { RegisterDto } from './dtos/register-dto';
import { GoogleDto } from './dtos/google-dto';
import { CustomHttpException } from 'src/common/exception/custom-http.excep';
import { CustomI18nService } from 'src/common/services/custom-i18n.service';
const bcrypt = require('bcryptjs');

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private User: Model<User>,
    @Inject(CustomI18nService) private customI18nService: CustomI18nService,
  ) {}

  async createAccount(data: RegisterDto): Promise<Object> {
    const user = await this.User.findOne({ email: data.email });

    if (user) {
      throw new CustomHttpException(
        this.customI18nService.translate('err.USER_EXIT'),
        400,
      );
    }

    const userCreated = await new this.User(data);
    await userCreated.save();
    return {
      message: this.customI18nService.translate('validation.USER_REGISTER'),
      userData: userCreated,
    };
  }

  async googleLogin(data: GoogleDto): Promise<Object> {
    const { email } = data;
    let user = await this.User.findOne({ email });

    if (!user) {
      user = new this.User({ ...data, provider: 'google' });
      return await user.save();
    }

    return {
      message: this.customI18nService.translate('validation.USER_REGISTER'),
      userData: user,
    };
  }

  async findUser(id: mongoose.Types.ObjectId) {
    return await this.User.findById(id);
  }

  async validateLoginData(email: string, password: string) {
    const user = await this.User.findOne({ email });

    if (!user)
      throw new CustomHttpException(
        this.customI18nService.translate('err.INVALID_CREDENTIALS'),
        400,
      );

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      throw new CustomHttpException(
        this.customI18nService.translate('err.INVALID_CREDENTIALS'),
        400,
      );

    return user;
  }

  // for frontend-----------------------------------
  async localSignup(email, password, confirmPassword) {
    const userExit = await this.User.findOne({ email });
    if (userExit) {
      throw new CustomHttpException(
        this.customI18nService.translate('err.USER_EXIT'),
        400,
      );
    }

    if (password.length < 8) {
      throw new CustomHttpException(
        this.customI18nService.translate('err.PASS_LEN'),
        400,
      );
    }
    if (password !== confirmPassword) {
      console.log(password);
      console.log(confirmPassword);

      throw new CustomHttpException(
        this.customI18nService.translate('err.PASSWORD_MISMATCH'),
        400,
      );
    }
    const user = new this.User({
      name: 'user chat',
      provider: 'local',
      email,
      password,
    });
    await user.save();
    return user;
  }
}
