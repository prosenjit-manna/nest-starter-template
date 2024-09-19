import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import appEnv from './env';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(appEnv.PORT);

  console.log(`Server is running on http://localhost:${appEnv.PORT}`);
}
bootstrap();
