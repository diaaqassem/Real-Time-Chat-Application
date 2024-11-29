import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { GoogleStrategy } from './strategy/google.strategy';
import { SessionSerializer } from 'src/utilities/SessionSerialisation';
import { LocalStrategy } from './strategy/local.strategy';
import { CustomI18nService } from 'src/common/services/custom-i18n.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleStrategy,
    SessionSerializer,
    LocalStrategy,
    CustomI18nService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
