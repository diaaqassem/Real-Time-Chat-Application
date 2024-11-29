import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as session from 'express-session';
import * as passport from 'passport';
import { I18nValidationPipe } from 'nestjs-i18n';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create<NestExpressApplication>(AppModule,{
  });
  app.enableCors()
  app.setGlobalPrefix('/api');
  // app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalPipes(
    new I18nValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // (google login)
  app.use(
    session({
      secret: 'diaa200',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 60,
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  // @desc  handle global error
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send({ error: err.message });
  });

  const port = process.env.PORT;
  await app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/api`);
  });
}
bootstrap();
