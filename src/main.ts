import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Thêm route mặc định
  const router = app.getHttpAdapter();
  router.get('/', (req, res) => {
    res.redirect('/api/swagger');
  });
  
  app.setGlobalPrefix('api');
  
  // Enable CORS với cấu hình cụ thể hơn
  app.enableCors({
    origin: ['http://localhost:3000', 'https://foxpc-backend.vercel.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Store API')
    .setDescription('API documentation for Store')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer('https://foxpc-backend.vercel.app')
    .addServer('http://localhost:3000')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/swagger', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'Store API Documentation'
  });

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
