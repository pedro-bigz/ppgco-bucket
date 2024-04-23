import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { patchNestJsSwagger } from 'nestjs-zod';

type AppSwaggerDataType = {
  title: string;
  description: string;
  version: string;
};

export class AppSwagger {
  constructor(private data: AppSwaggerDataType) {
    patchNestJsSwagger();
  }

  static create(data: AppSwaggerDataType) {
    return new AppSwagger(data);
  }

  build() {
    return new DocumentBuilder()
      .setTitle(this.data.title)
      .setDescription(this.data.description)
      .setVersion(this.data.version)
      .build();
  }

  createDocument(app: INestApplication<any>) {
    return SwaggerModule.createDocument(app, this.build());
  }

  configure(app: INestApplication<any>) {
    SwaggerModule.setup('swagger', app, this.createDocument(app));
  }
}
