import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  
  // Add express json middleware trước
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Thêm route mặc định
  const router = app.getHttpAdapter();
  router.get('/', (req, res) => {
    res.redirect('/api/swagger');
  });
  
  app.setGlobalPrefix('api');

  // Cấu hình swagger
  const config = new DocumentBuilder()
    .setTitle('Store API')
    .setDescription('API documentation for Store')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/swagger', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tryItOutEnabled: true,
      displayRequestDuration: true,
      filter: true
    },
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Store API Documentation'
  });

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
}

bootstrap();
