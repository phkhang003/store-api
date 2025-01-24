import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors({
    origin: ['https://foxpc-backend.vercel.app', 'http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  
  // Security middleware
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: false,
    })
  );
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 phút
      max: 100, // Giới hạn 100 request mỗi IP
      message: 'Quá nhiều request từ IP này, vui lòng thử lại sau 15 phút',
      standardHeaders: true,
      legacyHeaders: false,
      skipSuccessfulRequests: false,
      keyGenerator: (req) => {
        return req.ip || req.connection.remoteAddress;
      },
    })
  );
  
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Store API')
    .setDescription('API documentation for Store')
    .setVersion('1.0')
    .addServer('https://foxpc-backend.vercel.app', 'Production')
    .addServer('http://localhost:3000', 'Development')
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'Store API Documentation',
    customfavIcon: '/favicon.ico',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'none',
    },
  });

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
