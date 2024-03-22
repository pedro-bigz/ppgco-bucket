import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppSwagger } from './app.swagger';
import { configHelper } from 'core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (!configHelper.isProduction()) {
    const swaggerData = {
      title: process.env.APP_NAME as string,
      description: process.env.APP_DESCRIPTION as string,
      version: process.env.APP_VERSION as string,
    };

    AppSwagger.create(swaggerData).configure(app);
  }

  app.enableCors();

  await app.listen(configHelper.getPort('4002'));
}
bootstrap();
