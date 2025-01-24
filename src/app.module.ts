import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true // Làm cho ConfigModule có thể truy cập từ mọi nơi
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      retryWrites: true,
      w: 'majority',
      connectionFactory: (connection) => {
        connection.on('connected', () => {
          console.log('');
          console.log('🗄️ MongoDB connected successfully');
          console.log('📊 Database:', connection.db.databaseName);
          console.log('');
        });
        connection.on('error', (error) => {
          console.error('❌ MongoDB connection error:', error);
        });
        return connection;
      }
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
