import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import helmet from 'helmet';
import * as compression from 'compression';
import { CustomLogger } from './common/services/logger.service';
import { json } from 'express';
import * as morgan from 'morgan';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new CustomLogger(),
  });
  const configService = app.get(ConfigService);
  
  // Security
  app.use(json({ limit: '10mb' }));
  app.use((req, res, next) => {
    res.setTimeout(30000, () => {
      res.status(408).send('Request timeout');
    });
    next();
  });
  app.use(helmet());
  app.use(compression());
  app.use(morgan('combined'));
  
  app.setGlobalPrefix('api');
  
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  // Global pipes, filters and interceptors
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true
  }));
  
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Store API')
    .setDescription('API documentation for Store')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  
  // Chỉ định security scheme cho bearer token
  document.components.securitySchemes = {
    bearer: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT'
    }
  };

  SwaggerModule.setup('api/swagger', app, document);

  const port = configService.get('PORT') || 3001;
  const apiBaseUrl = configService.get<string>('API_BASE_URL', 'http://localhost');
  
  await app.listen(port, () => {
    console.log('=================================');
    console.log('🚀 Ứng dụng đang chạy tại:');
    console.log('📝 Swagger UI: http://localhost:3000/api/swagger');
    console.log('=================================');
  });
}

bootstrap().catch(err => {
  console.error('Error starting server:', err);
  process.exit(1);
});
