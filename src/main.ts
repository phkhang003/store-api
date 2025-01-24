import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable trust proxy
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.enable('trust proxy');
  
  // Enable CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
    credentials: true,
  });
  
  // Bỏ helmet và rate limit tạm thời để debug
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  const config = new DocumentBuilder()
    .setTitle('Store API')
    .setDescription('API documentation for Store')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  
  // Thay đổi route swagger thành root path
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  const isDev = process.env.NODE_ENV !== 'production';
  const baseUrl = isDev 
    ? `http://localhost:${port}`
    : 'https://foxpc-backend.vercel.app';

  await app.listen(port, '0.0.0.0', () => {
    console.log('');
    console.log('🚀 API đang chạy tại:');
    console.log(`📝 Swagger UI: ${baseUrl}/api`);
    console.log(`🌐 API endpoint: ${baseUrl}`);
    console.log('');
  });
}

bootstrap();
