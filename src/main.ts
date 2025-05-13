import 'dotenv/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HTTPExceptionFilter } from './infrastructure/error-handlers/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(process.env.GLOBAL_PREFIX || '/api');
  app.useGlobalPipes(new ValidationPipe())
  const adapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new HTTPExceptionFilter(adapterHost));
  const port = process.env.PORT || 3002;
  await app.listen(port);
  console.log(`Listening API on port: ${port}`);
}
bootstrap();
