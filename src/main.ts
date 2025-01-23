import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Security middleware
  app.use(helmet());
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      message: 'Quá nhiều request từ IP này, vui lòng thử lại sau 15 phút'
    })
  );
  
  // Cấu hình CORS cho Vercel
  app.enableCors({
    origin: [
      'https://foxpc-backend.vercel.app',
      'https://foxpc-store.vercel.app',
      'https://localhost:3000',
      'http://localhost:3000'
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Store API')
    .setDescription('API documentation for Store')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'access-token',
    )
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port, () => {
    console.log('');
    console.log('🚀 API đang chạy tại:');
    console.log(`📝 Swagger UI: http://localhost:${port}/api`);
    console.log(`🌐 API endpoint: http://localhost:${port}`);
    console.log('');
  });
}

bootstrap();
