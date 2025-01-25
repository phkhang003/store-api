import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  
  // Add express json middleware
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.use(express.json());
  expressApp.use(express.urlencoded({ extended: true }));
  
  // Enable CORS
  app.enableCors({
    origin: true,
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
  SwaggerModule.setup('api/swagger', app, document);

  const port = process.env.PORT || 3000;
  const isDev = process.env.NODE_ENV !== 'production';
  const baseUrl = isDev 
    ? `http://localhost:${port}`
    : 'https://foxpc-backend.vercel.app';

  await app.listen(port, '0.0.0.0', () => {
    console.log('');
    console.log('🚀 API đang chạy tại:');
    console.log(`📝 Swagger UI: ${baseUrl}/api/swagger`);
    console.log(`🌐 API endpoint: ${baseUrl}`);
    console.log('');
  });
}

bootstrap();
