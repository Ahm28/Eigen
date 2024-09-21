import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Library Management')
    .setDescription('Library Management API description')
    .setVersion('1.0')
    .build();
  const documents = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documents);

  await app.listen(3000);
}
bootstrap();
