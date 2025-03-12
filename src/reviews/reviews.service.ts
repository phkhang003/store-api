import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review } from './schemas/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { ProductsService } from '../products/products.service';
import { OrdersService } from '../orders/orders.service';
import { OrderStatus } from '../orders/enums/order.enum';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<Review>,
    private readonly productsService: ProductsService,
    private readonly ordersService: OrdersService
  ) {}

  async create(userId: string, productId: string, createReviewDto: CreateReviewDto) {
    const orders = await this.ordersService.findByUser(userId);
    const hasPurchased = orders.some(order => 
      order.orderStatus === OrderStatus.DELIVERED && 
      order.items.some(item => item.productId.toString() === productId)
    );

    if (!hasPurchased) {
      throw new BadRequestException('Bạn cần mua sản phẩm trước khi đánh giá');
    }

    const existingReview = await this.reviewModel.findOne({
      userId,
      productId
    });

    if (existingReview) {
      throw new BadRequestException('Bạn đã đánh giá sản phẩm này');
    }

    const review = await this.reviewModel.create({
      ...createReviewDto,
      userId,
      productId
    });

    await this.productsService.updateRating(productId);

    return review;
  }

  async findByProduct(productId: string, options: { page: number; limit: number; sort: string; rating?: number }) {
    const { page, limit, sort, rating } = options;
    const skip = (page - 1) * limit;

    // Kiểm tra sản phẩm tồn tại
    const product = await this.productsService.findOne(productId);
    if (!product) {
      throw new NotFoundException(`Sản phẩm với ID ${productId} không tồn tại`);
    }

    // Xây dựng query
    const query: any = { productId };
    if (rating) {
      query.rating = rating;
    }

    // Xác định cách sắp xếp
    let sortOption = {};
    switch (sort) {
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'highest':
        sortOption = { rating: -1 };
        break;
      case 'lowest':
        sortOption = { rating: 1 };
        break;
      case 'helpful':
        sortOption = { helpfulCount: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    // Thực hiện truy vấn
    const reviews = await this.reviewModel.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .populate('userId', 'name avatar')
      .exec();

    const total = await this.reviewModel.countDocuments(query);

    // Tính toán thống kê đánh giá
    const ratingStats = await this.getRatingStatistics(productId);

    return {
      reviews,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      statistics: ratingStats
    };
  }

  async findByUser(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const reviews = await this.reviewModel.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('productId', 'name images price')
      .exec();

    const total = await this.reviewModel.countDocuments({ userId });

    return {
      reviews,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  private async getRatingStatistics(productId: string) {
    const result = await this.reviewModel.aggregate([
      { $match: { productId: new (this.reviewModel as any).mongoose.Types.ObjectId(productId) } },
      { 
        $group: { 
          _id: '$rating', 
          count: { $sum: 1 }
        } 
      },
      { $sort: { _id: -1 } }
    ]);

    const totalReviews = result.reduce((sum, item) => sum + item.count, 0);
    
    // Tạo mảng thống kê cho từng mức đánh giá (5 sao -> 1 sao)
    const ratingCounts = [5, 4, 3, 2, 1].map(rating => {
      const found = result.find(item => item._id === rating);
      return {
        rating,
        count: found ? found.count : 0,
        percentage: totalReviews > 0 ? Math.round((found ? found.count : 0) * 100 / totalReviews) : 0
      };
    });

    // Tính điểm đánh giá trung bình
    const averageRating = totalReviews > 0
      ? result.reduce((sum, item) => sum + (item._id * item.count), 0) / totalReviews
      : 0;

    return {
      averageRating: parseFloat(averageRating.toFixed(1)),
      totalReviews,
      ratingCounts
    };
  }
} 