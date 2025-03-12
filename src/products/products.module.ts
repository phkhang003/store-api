import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product, ProductSchema } from './schemas/product.schema';
import { Review, ReviewSchema } from './schemas/review.schema';
import { ProductSuggestion, ProductSuggestionSchema } from './schemas/product-suggestion.schema';
import { SecurityModule } from '../security/security.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Review.name, schema: ReviewSchema },
      { name: ProductSuggestion.name, schema: ProductSuggestionSchema }
    ]),
    SecurityModule
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService]
})
export class ProductsModule {}