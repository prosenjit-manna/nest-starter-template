import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import appEnv from './env';
import './shared/sentry/sentry-init';
import { AppValidationPipe } from './validator.pipe';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin:
      appEnv.CORS_ORIGIN === '*'
        ? appEnv.CORS_ORIGIN
        : appEnv.CORS_ORIGIN.split(','), // Allow all origins
  });

  // Enable global validation
  app.useGlobalPipes(new AppValidationPipe());

  await app.listen(appEnv.PORT);

  console.log(`Server is running on http://localhost:${appEnv.PORT}`);
}
bootstrap();
