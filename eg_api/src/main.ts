import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(cookieParser());
  const config = new DocumentBuilder()
    .setTitle('Easy Generator API')
    .setDescription('Easy generator Nestjs/Mongo auth  with passport ')
    .setVersion('1.0')
    .addTag('EG')
    .build();

  if (process.env.NODE_ENV != 'production') {
    // add swagger
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);
    // enable cors for dev
    app.enableCors({
      origin: 'http://localhost:5173',
      credentials: true,
    });
  }
  console.log(process.env);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
