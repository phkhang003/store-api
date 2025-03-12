import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { AppLogger } from './logger.service';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectConnection() private connection: Connection,
    private logger: AppLogger
  ) {
    this.logger.setContext('DatabaseService');
    this.setupIndexes();
  }

  private async setupIndexes() {
    try {
      // Ensure indexes for better query performance
      const collections = await this.connection.db.collections();
      
      for (const collection of collections) {
        // Products indexes
        if (collection.collectionName === 'products') {
          await collection.createIndex({ name: 'text', description: 'text' });
          await collection.createIndex({ category: 1 });
          await collection.createIndex({ brand: 1 });
          await collection.createIndex({ createdAt: -1 });
        }
        
        // Orders indexes
        if (collection.collectionName === 'orders') {
          await collection.createIndex({ userId: 1 });
          await collection.createIndex({ status: 1 });
          await collection.createIndex({ createdAt: -1 });
        }
        
        // Users indexes
        if (collection.collectionName === 'users') {
          await collection.createIndex({ email: 1 }, { unique: true });
          await collection.createIndex({ username: 1 }, { unique: true });
        }
      }
      
      this.logger.log('Database indexes setup completed');
    } catch (error) {
      this.logger.error('Error setting up database indexes', error.stack);
    }
  }

  async getQueryStats() {
    try {
      const stats = await this.connection.db.command({ serverStatus: 1 });
      return {
        operations: stats.opcounters,
        connections: stats.connections,
        network: stats.network
      };
    } catch (error) {
      this.logger.error('Error getting database stats', error.stack);
      return null;
    }
  }

  async healthCheck() {
    try {
      await this.connection.db.admin().ping();
      return true;
    } catch (error) {
      this.logger.error('Database health check failed', error.stack);
      return false;
    }
  }
} 