import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Review, ReviewDocument } from './schemas/review.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>
  ) {}

  async create(createProductDto: CreateProductDto): Promise<ProductDocument> {
    const newProduct = new this.productModel(createProductDto);
    return newProduct.save();
  }

  async findAll(query: any = {}): Promise<ProductDocument[]> {
    const { limit = 10, page = 1, sort = 'createdAt', order = 'desc', ...filters } = query;
    
    // Xử lý các filter
    const filterQuery = {};
    if (filters.name) {
      filterQuery['name'] = { $regex: filters.name, $options: 'i' };
    }
    if (filters.categories) {
      filterQuery['categories'] = { $in: Array.isArray(filters.categories) ? filters.categories : [filters.categories] };
    }
    if (filters.minPrice) {
      filterQuery['price'] = { ...filterQuery['price'] || {}, $gte: Number(filters.minPrice) };
    }
    if (filters.maxPrice) {
      filterQuery['price'] = { ...filterQuery['price'] || {}, $lte: Number(filters.maxPrice) };
    }
    
    // Mặc định chỉ hiển thị sản phẩm active
    if (filters.showInactive !== 'true') {
      filterQuery['isActive'] = true;
    }
    
    const sortOptions = {};
    sortOptions[sort] = order === 'asc' ? 1 : -1;
    
    return this.productModel
      .find(filterQuery)
      .populate('brandId', 'name image')
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }

  async findOne(id: string): Promise<ProductDocument> {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<ProductDocument> {
    const updatedProduct = await this.productModel.findByIdAndUpdate(
      id,
      updateProductDto,
      { new: true }
    );
    
    if (!updatedProduct) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }
    
    return updatedProduct;
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.productModel.findByIdAndDelete(id);
    
    if (!result) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }
    
    return { message: 'Xóa sản phẩm thành công' };
  }

  async toggleActive(id: string): Promise<ProductDocument> {
    const product = await this.productModel.findById(id);
    
    if (!product) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }
    
    product.isActive = !product.isActive;
    return product.save();
  }

  async countProducts(filters: any = {}): Promise<number> {
    const filterQuery = {};
    if (filters.name) {
      filterQuery['name'] = { $regex: filters.name, $options: 'i' };
    }
    if (filters.categories) {
      filterQuery['categories'] = { $in: Array.isArray(filters.categories) ? filters.categories : [filters.categories] };
    }
    
    if (filters.showInactive !== 'true') {
      filterQuery['isActive'] = true;
    }
    
    return this.productModel.countDocuments(filterQuery);
  }

  /**
   * Cập nhật đánh giá trung bình và số lượng đánh giá của sản phẩm
   */
  async updateRating(productId: string) {
    const reviews = await this.reviewModel.find({ productId });
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
    
    await this.productModel.findByIdAndUpdate(productId, {
      rating: averageRating,
      reviewCount: reviews.length
    });
  }

  async search(options: {
    keyword?: string;
    skinType?: string;
    productType?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
  }): Promise<any> {
    const {
      keyword,
      skinType,
      productType,
      brand,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10
    } = options;

    const query: any = { isActive: true };

    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }

    if (skinType) {
      query.skinType = skinType;
    }

    if (productType) {
      query.productType = productType;
    }

    if (brand) {
      query.brand = brand;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) {
        query.price.$gte = minPrice;
      }
      if (maxPrice !== undefined) {
        query.price.$lte = maxPrice;
      }
    }

    const skip = (page - 1) * limit;
    
    const [products, total] = await Promise.all([
      this.productModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      this.productModel.countDocuments(query)
    ]);

    return {
      data: products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
} 