import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import * as dotenv from 'dotenv';
import { PassportModule } from '@nestjs/passport';
import { GatewayModule } from './gateway/gateway.module';
import { RoomsModule } from './rooms/rooms.module';
import { MessageModule } from './message/message.module';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import * as path from 'path';

dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB_URL),
    UserModule,
    AuthModule,
    PassportModule.register({ session: true }),
    GatewayModule,
    RoomsModule,
    MessageModule,
    I18nModule.forRoot({
      fallbackLanguage: 'ar', // default language
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'), // path to your translations
        watch: true, // watch for changes
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] }, // query resolver
        AcceptLanguageResolver, // resolver for AcceptLanguage
        new HeaderResolver(['x-lang']), // resolver for x-lang header
      ],
    }),
  ],
})
export class AppModule {}
