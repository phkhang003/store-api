import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { Request, Response } from 'express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

let app;

async function bootstrap() {
  if (!app) {
    app = await NestFactory.create(AppModule);
    app.enableCors();
    app.setGlobalPrefix('api', {
      exclude: ['/'],
    });
    app.useGlobalPipes(new ValidationPipe());
    
    const config = new DocumentBuilder()
      .setTitle('Store API')
      .setDescription('API documentation for Store')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
      
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/swagger', app, document);

    app.getHttpAdapter().get('/hello', (req: Request, res: Response) => {
      res.json({ message: 'Xin chào từ NestJS API!' });
    });

    app.getHttpAdapter().get('/', (req: Request, res: Response) => {
      res.redirect(301, '/api/swagger');
    });
    
    await app.init();
  }
  return app;
}

export default async function handler(req, res) {
  const app = await bootstrap();
  const instance = app.getHttpAdapter().getInstance();
  return instance(req, res);
} 