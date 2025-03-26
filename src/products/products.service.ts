import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductNotFoundException, InsufficientStockException } from '../common/exceptions';
import { SearchProductDto } from './dto/search-product.dto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>
  ) {}

  async create(createProductDto: CreateProductDto): Promise<ProductDocument> {
    const createdProduct = new this.productModel(createProductDto);
    return createdProduct.save();
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{
    items: ProductDocument[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.productModel.find().skip(skip).limit(limit).exec(),
      this.productModel.countDocuments()
    ]);

    return {
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findOne(id: string): Promise<ProductDocument> {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new ProductNotFoundException(id);
    }
    return product;
  }

  async update(id: string, updateProductDto: Partial<CreateProductDto>): Promise<ProductDocument> {
    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true });
    if (!updatedProduct) {
      throw new ProductNotFoundException(id);
    }
    return updatedProduct;
  }

  async remove(id: string): Promise<ProductDocument> {
    const deletedProduct = await this.productModel.findByIdAndDelete(id);
    if (!deletedProduct) {
      throw new ProductNotFoundException(id);
    }
    return deletedProduct;
  }

  async findByCategory(categoryId: string): Promise<ProductDocument[]> {
    return this.productModel.find({ categoryIds: categoryId }).exec();
  }

  async findByBrand(brandId: string): Promise<ProductDocument[]> {
    return this.productModel.find({ brandId }).exec();
  }

  async updateStock(id: string, quantity: number): Promise<ProductDocument> {
    this.logger.debug(`Cập nhật số lượng tồn kho cho sản phẩm ${id}: ${quantity}`);
    
    const product = await this.productModel.findById(id);
    if (!product) {
      this.logger.error(`Không tìm thấy sản phẩm với ID ${id}`);
      throw new ProductNotFoundException(id);
    }
    
    // Cập nhật số lượng tồn kho cho tất cả chi nhánh
    product.inventory = product.inventory.map(inv => ({
      ...inv,
      quantity: quantity
    }));

    // Tự động cập nhật trạng thái
    product.status = quantity > 0 ? 'active' : 'out_of_stock';
    
    return product.save();
  }

  async updatePrice(id: string, price: number): Promise<ProductDocument> {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new ProductNotFoundException(id);
    }

    product.price = price;
    return product.save();
  }

  async searchProducts(searchDto: SearchProductDto): Promise<ProductDocument[]> {
    const query: any = {};

    if (searchDto.keyword) {
      query.$or = [
        { name: { $regex: searchDto.keyword, $options: 'i' } },
        { 'description.short': { $regex: searchDto.keyword, $options: 'i' } },
        { tags: { $in: [new RegExp(searchDto.keyword, 'i')] } }
      ];
    }

    if (searchDto.categoryId) {
      query.categoryIds = searchDto.categoryId;
    }

    if (searchDto.brandId) {
      query.brandId = searchDto.brandId;
    }

    if (searchDto.minPrice !== undefined || searchDto.maxPrice !== undefined) {
      query.price = {};
      if (searchDto.minPrice !== undefined) {
        query.price.$gte = searchDto.minPrice;
      }
      if (searchDto.maxPrice !== undefined) {
        query.price.$lte = searchDto.maxPrice;
      }
    }

    return this.productModel.find(query).exec();
  }
} 