import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Promotion, PromotionDocument } from './schemas/promotion.schema';
import { PromotionUsage, PromotionUsageDocument } from './schemas/promotion-usage.schema';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { OrdersService } from '../orders/orders.service';
import { DiscountType } from './schemas/promotion.schema';

@Injectable()
export class PromotionsService {
  constructor(
    @InjectModel(Promotion.name) private promotionModel: Model<PromotionDocument>,
    @InjectModel(PromotionUsage.name) private promotionUsageModel: Model<PromotionUsageDocument>,
    @Inject(forwardRef(() => OrdersService))
    private ordersService: OrdersService
  ) {}

  async create(createPromotionDto: CreatePromotionDto): Promise<Promotion> {
    const existingPromotion = await this.promotionModel.findOne({ 
      code: createPromotionDto.code.toUpperCase() 
    });
    
    if (existingPromotion) {
      throw new BadRequestException(`Mã khuyến mãi ${createPromotionDto.code} đã tồn tại`);
    }

    const newPromotion = new this.promotionModel({
      ...createPromotionDto,
      code: createPromotionDto.code.toUpperCase()
    });
    
    return newPromotion.save();
  }

  async validate(code: string, userId: string, orderAmount: number) {
    const promotion = await this.promotionModel.findOne({ code });
    if (!promotion) {
      throw new NotFoundException('Mã khuyến mãi không tồn tại');
    }

    if (!promotion.isActive) {
      throw new BadRequestException('Mã khuyến mãi đã hết hiệu lực');
    }

    if (promotion.startDate && new Date() < promotion.startDate) {
      throw new BadRequestException('Mã khuyến mãi chưa có hiệu lực');
    }

    if (promotion.endDate && new Date() > promotion.endDate) {
      throw new BadRequestException('Mã khuyến mãi đã hết hạn');
    }

    if (promotion.minOrderAmount && orderAmount < promotion.minOrderAmount) {
      throw new BadRequestException(
        `Giá trị đơn hàng tối thiểu để sử dụng mã là ${promotion.minOrderAmount}đ`
      );
    }

    if (promotion.maxUsage && promotion.usageCount >= promotion.maxUsage) {
      throw new BadRequestException('Mã khuyến mãi đã hết lượt sử dụng');
    }

    if (promotion.userMaxUsage) {
      const userUsageCount = await this.promotionUsageModel.countDocuments({
        promotionId: promotion._id,
        userId
      });

      if (userUsageCount >= promotion.userMaxUsage) {
        throw new BadRequestException(
          `Bạn đã sử dụng tối đa ${promotion.userMaxUsage} lần mã này`
        );
      }
    }

    if (promotion.firstOrderOnly) {
      const orders = await this.ordersService.findByUser(userId);
      if (orders.length > 0) {
        throw new BadRequestException('Mã chỉ áp dụng cho đơn hàng đầu tiên');
      }
    }

    let discountAmount = 0;
    if (promotion.discountType === DiscountType.PERCENTAGE) {
      discountAmount = (orderAmount * promotion.discountValue) / 100;
      if (promotion.maxDiscount && discountAmount > promotion.maxDiscount) {
        discountAmount = promotion.maxDiscount;
      }
    } else {
      discountAmount = promotion.discountValue;
    }

    return {
      discountAmount,
      promotion
    };
  }

  async applyPromotion(code: string, userId: string, orderId: string): Promise<any> {
    const promotion = await this.promotionModel.findOne({ 
      code: code.toUpperCase(),
      isActive: true
    });

    if (!promotion) {
      throw new NotFoundException('Mã khuyến mãi không tồn tại hoặc đã hết hạn');
    }

    // Cập nhật số lần sử dụng và người dùng đã sử dụng
    await this.promotionModel.updateOne(
      { _id: promotion._id },
      { 
        $inc: { usageCount: 1 },
        $addToSet: { usedBy: userId }
      }
    );

    return { success: true, message: 'Áp dụng mã khuyến mãi thành công' };
  }
} 