import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const logger = new Logger('API Handler');
let app;

async function bootstrap() {
  if (!app) {
    app = await NestFactory.create(AppModule);
    app.enableCors();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe());

    const config = new DocumentBuilder()
      .setTitle('Store API')
      .setDescription('API documentation for Store')
      .setVersion('1.0')
      .addBearerAuth()
      .addApiKey(
        {
          type: 'apiKey',
          name: 'x-api-key',
          in: 'header',
        },
        'x-api-key'
      )
      .build();
      
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/swagger', app, document);

    // Add root route handler
    app.getHttpAdapter().get('/', (req, res) => {
      res.redirect('/api/swagger');
    });

    await app.init();
  }
  return app;
}

export default async function handler(req, res) {
  try {
    logger.log(`Processing ${req.method} ${req.url}`);
    const app = await bootstrap();
    const instance = app.getHttpAdapter().getInstance();
    return instance(req, res);
  } catch (error) {
    logger.error('Handler error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
} 