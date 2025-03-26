import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    private readonly ordersService: OrdersService
  ) {}

  async create(userId: string, createReviewDto: CreateReviewDto): Promise<ReviewDocument> {
    // Kiểm tra đơn hàng có tồn tại và thuộc về user không
    const order = await this.ordersService.findOne(createReviewDto.orderId);
    if (order.userId.toString() !== userId) {
      throw new BadRequestException('Bạn không có quyền đánh giá đơn hàng này');
    }

    // Kiểm tra sản phẩm có trong đơn hàng không
    const orderProduct = order.products.find(
      p => p.productId.toString() === createReviewDto.productId &&
      (!createReviewDto.variantId || p.variantId?.toString() === createReviewDto.variantId)
    );
    if (!orderProduct) {
      throw new BadRequestException('Sản phẩm không tồn tại trong đơn hàng');
    }

    // Kiểm tra đã đánh giá chưa
    const existingReview = await this.reviewModel.findOne({
      userId: new MongooseSchema.Types.ObjectId(userId),
      productId: new MongooseSchema.Types.ObjectId(createReviewDto.productId),
      orderId: new MongooseSchema.Types.ObjectId(createReviewDto.orderId),
      variantId: createReviewDto.variantId ? new MongooseSchema.Types.ObjectId(createReviewDto.variantId) : undefined
    });

    if (existingReview) {
      throw new BadRequestException('Bạn đã đánh giá sản phẩm này trong đơn hàng');
    }

    const review = new this.reviewModel({
      ...createReviewDto,
      userId: new MongooseSchema.Types.ObjectId(userId),
      productId: new MongooseSchema.Types.ObjectId(createReviewDto.productId),
      orderId: new MongooseSchema.Types.ObjectId(createReviewDto.orderId),
      variantId: createReviewDto.variantId ? new MongooseSchema.Types.ObjectId(createReviewDto.variantId) : undefined,
      verified: true // Đã xác minh vì kiểm tra từ đơn hàng
    });

    return review.save();
  }

  async findAll(productId: string): Promise<ReviewDocument[]> {
    return this.reviewModel
      .find({ 
        productId: new MongooseSchema.Types.ObjectId(productId),
        status: 'approved'
      })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .exec();
  }

  async addReply(reviewId: string, userId: string, content: string): Promise<ReviewDocument> {
    const review = await this.reviewModel.findById(reviewId);
    if (!review) {
      throw new NotFoundException('Đánh giá không tồn tại');
    }

    review.reply.push({
      userId: new MongooseSchema.Types.ObjectId(userId),
      content,
      createdAt: new Date()
    });

    return review.save();
  }

  async updateStatus(reviewId: string, status: string): Promise<ReviewDocument> {
    const review = await this.reviewModel.findById(reviewId);
    if (!review) {
      throw new NotFoundException('Đánh giá không tồn tại');
    }

    review.status = status;
    return review.save();
  }

  async likeReview(reviewId: string, userId: string): Promise<ReviewDocument> {
    const review = await this.reviewModel.findById(reviewId);
    if (!review) {
      throw new NotFoundException('Đánh giá không tồn tại');
    }

    // Tăng số lượt like
    review.likes += 1;
    return review.save();
  }

  async findByUser(userId: string): Promise<ReviewDocument[]> {
    return this.reviewModel
      .find({ userId: new MongooseSchema.Types.ObjectId(userId) })
      .populate('productId', 'name images')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findPendingReviews(): Promise<ReviewDocument[]> {
    return this.reviewModel
      .find({ status: 'pending' })
      .populate('productId', 'name')
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .exec();
  }

  async delete(reviewId: string): Promise<void> {
    const result = await this.reviewModel.deleteOne({ 
      _id: new MongooseSchema.Types.ObjectId(reviewId) 
    });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Đánh giá không tồn tại');
    }
  }
} 