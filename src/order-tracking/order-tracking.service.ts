import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { OrderTracking, OrderTrackingDocument } from './schemas/order-tracking.schema';
import { CreateTrackingDto } from './dto/create-tracking.dto';
import { OrdersService } from '../orders/orders.service';
import { OrderStatus } from './enums/order-status.enum';

@Injectable()
export class OrderTrackingService {
  constructor(
    @InjectModel(OrderTracking.name) private orderTrackingModel: Model<OrderTrackingDocument>,
    private readonly ordersService: OrdersService
  ) {}

  async create(userId: string, createTrackingDto: CreateTrackingDto): Promise<OrderTrackingDocument> {
    // Validate status
    if (!Object.values(OrderStatus).includes(createTrackingDto.state as OrderStatus)) {
      throw new BadRequestException('Trạng thái không hợp lệ');
    }

    // Kiểm tra đơn hàng tồn tại
    await this.ordersService.findOne(createTrackingDto.orderId);

    const tracking = await this.orderTrackingModel.findOne({ 
      orderId: new MongooseSchema.Types.ObjectId(createTrackingDto.orderId) 
    });

    if (tracking) {
      // Thêm trạng thái mới
      tracking.status.push({
        state: createTrackingDto.state,
        description: createTrackingDto.description,
        location: createTrackingDto.location,
        timestamp: new Date(),
        updatedBy: new MongooseSchema.Types.ObjectId(userId)
      });

      if (createTrackingDto.shippingCarrier) {
        tracking.shippingCarrier = createTrackingDto.shippingCarrier;
      }

      if (createTrackingDto.estimatedDelivery) {
        tracking.estimatedDelivery = createTrackingDto.estimatedDelivery;
      }

      if (createTrackingDto.state === 'delivered') {
        tracking.actualDelivery = new Date();
      }

      return tracking.save();
    }

    // Tạo mới nếu chưa có
    return this.orderTrackingModel.create({
      orderId: new MongooseSchema.Types.ObjectId(createTrackingDto.orderId),
      status: [{
        state: createTrackingDto.state,
        description: createTrackingDto.description,
        location: createTrackingDto.location,
        timestamp: new Date(),
        updatedBy: new MongooseSchema.Types.ObjectId(userId)
      }],
      shippingCarrier: createTrackingDto.shippingCarrier,
      estimatedDelivery: createTrackingDto.estimatedDelivery
    });
  }

  async findByOrder(orderId: string): Promise<OrderTrackingDocument> {
    const tracking = await this.orderTrackingModel
      .findOne({ orderId: new MongooseSchema.Types.ObjectId(orderId) })
      .populate('status.updatedBy', 'fullName email')
      .exec();

    if (!tracking) {
      throw new NotFoundException('Không tìm thấy thông tin vận chuyển');
    }

    return tracking;
  }
} 