import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

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

  const config = new DocumentBuilder()
    .setTitle('Store API')
    .setDescription('API documentation for Store')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/swagger', app, document);

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
