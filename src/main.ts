import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HTTPExceptionFilter } from './infra/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(process.env.GLOBAL_PREFIX || '/api');
  const adapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new HTTPExceptionFilter(adapterHost));
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Listening API on port: ${port}`)
}
bootstrap();
