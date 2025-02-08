import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

let app;
const logger = new Logger('API');

async function bootstrap() {
  if (!app) {
    try {
      logger.log('Khởi tạo ứng dụng NestJS...');
      app = await NestFactory.create(AppModule);
      
      logger.log('Cấu hình CORS...');
      app.enableCors();
      
      logger.log('Cấu hình global prefix...');
      app.setGlobalPrefix('api', {
        exclude: ['/'],
      });
      
      app.useGlobalPipes(new ValidationPipe());
      
      logger.log('Cấu hình Swagger...');
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
      
      logger.log('Khởi tạo ứng dụng...');
      await app.init();
      logger.log('Ứng dụng đã khởi tạo thành công!');
    } catch (error) {
      logger.error('Lỗi khởi tạo ứng dụng:', error);
      throw error;
    }
  }
  return app;
}

// Thêm handler function cho Vercel
export default async function handler(req: any, res: any) {
  try {
    logger.log(`Xử lý request ${req.method} ${req.url}`);
    const app = await Promise.race([
      bootstrap(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Bootstrap timeout')), 30000)
      )
    ]);
    
    const instance = app.getHttpAdapter().getInstance();
    return instance(req, res);
  } catch (error) {
    logger.error('Lỗi trong handler:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message,
      path: req.url
    });
  }
} 