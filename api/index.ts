import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { Request, Response } from 'express';

let app;

async function bootstrap() {
  if (!app) {
    app = await NestFactory.create(AppModule);
    app.enableCors();
    app.setGlobalPrefix('api', {
      exclude: ['/'],
    });
    app.useGlobalPipes(new ValidationPipe());
    
    // Thêm route chuyển hướng
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