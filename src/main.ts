import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  
  app.setGlobalPrefix('api', {
    exclude: ['/'],
  });
  
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
    credentials: true
  });
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  // Serve static files
  app.use('/public', express.static(join(__dirname, '..', 'public')));
  
  const customCss = `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info .title { 
      color: #2c3e50;
      font-size: 36px;
    }
    .swagger-ui .info { 
      margin: 30px 0;
    }
    .swagger-ui .scheme-container {
      background: #f8f9fa;
      box-shadow: none;
    }
  `;
  
  const config = new DocumentBuilder()
    .setTitle('Store API')
    .setDescription('API documentation for Store Management System')
    .setVersion('1.0')
    .addBearerAuth()
    .addApiKey({ 
      type: 'apiKey',
      name: 'x-api-key',
      in: 'header',
      description: 'API key for external access'
    }, 'x-api-key')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  
  SwaggerModule.setup('api', app, document, {
    customfavIcon: '/public/favicon.png',
    customSiteTitle: 'Store API Documentation',
    customCss: customCss,
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true
    }
  });

  app.getHttpAdapter().get('/', (req: Request, res: Response) => {
    res.status(301).redirect('/api/swagger');
  });

  const port = configService.get<number>('PORT', 3000);
  const apiBaseUrl = configService.get<string>('API_BASE_URL', 'http://localhost');
  
  await app.listen(port, '0.0.0.0', () => {
    logger.log(`Application is running on: ${apiBaseUrl}:${port}`);
    logger.log(`Swagger UI available at: ${apiBaseUrl}:${port}/api/swagger`);
  });
}

bootstrap().catch(err => {
  console.error('Error starting server:', err);
  process.exit(1);
});
