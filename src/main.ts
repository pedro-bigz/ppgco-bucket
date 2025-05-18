import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from 'src/app.module';
import { AppSwagger } from 'src/app.swagger';
import { getPort, ipv4Url, isProduction } from 'src/utils';
import { AppLogger } from './app.logger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: AppLogger.create(isProduction()).config(),
  });

  if (!isProduction()) {
    const swaggerData = {
      title: process.env.APP_NAME as string,
      description: process.env.APP_DESCRIPTION as string,
      version: process.env.APP_VERSION as string,
    };

    AppSwagger.create(swaggerData).configure(app);
  }

  app.enableCors();

  await app.listen(getPort(4001));

  const url = await app.getUrl();

  if (!isProduction()) {
    console.log(`Application is running on: ${ipv4Url(url)}`);
    console.log(`You can access swagger on: ${ipv4Url(url)}/swagger`);
  }
}
bootstrap();
