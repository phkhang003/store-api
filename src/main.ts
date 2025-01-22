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
      windowMs: 15 * 60 * 1000, // 15 phút
      max: 100, // Giới hạn 100 request mỗi IP trong 15 phút
      message: 'Quá nhiều request từ IP này, vui lòng thử lại sau 15 phút'
    })
  );
  
  // Cấu hình CORS chi tiết
  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  });
  
  // Thêm validation pipe
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Store API')
    .setDescription('API documentation for Store')
    .setVersion('1.0')
    .addBearerAuth()
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
