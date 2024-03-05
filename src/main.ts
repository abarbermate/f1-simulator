import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const port = process.env.PORT || 3000;
  await app.listen(port);

  const url = await app.getUrl();
  const accessibleUrl = url.replace('[::1]', 'localhost');

  console.log(`Application is running on: ${accessibleUrl}`);
}
bootstrap();
