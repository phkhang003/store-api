import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { OrderStatus, PaymentStatus } from './enums/order.enum';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ProductsService } from '../products/products.service';
import { UsersService } from '../users/users.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
import { PromotionsService } from '../promotions/promotions.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private readonly productsService: ProductsService,
    private readonly usersService: UsersService,
    private promotionsService: PromotionsService
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: string): Promise<Order> {
    let totalPrice = 0;
    for (const item of createOrderDto.items) {
      const product = await this.productsService.findOne(item.productId);
      if (!product) {
        throw new BadRequestException(`Sản phẩm với ID ${item.productId} không tồn tại`);
      }
      
      if (!product.isActive) {
        throw new BadRequestException(`Sản phẩm ${product.name} hiện không còn bán`);
      }

      if (product.stockQuantity < item.quantity) {
        throw new BadRequestException(
          `Sản phẩm ${product.name} chỉ còn ${product.stockQuantity} sản phẩm trong kho`
        );
      }

      const price = product.discountPercentage 
        ? product.price * (1 - product.discountPercentage / 100)
        : product.price;
        
      totalPrice += price * item.quantity;
    }

    let discount = 0;
    if (createOrderDto.couponCode) {
      const validationResult = await this.promotionsService.validate(
        createOrderDto.couponCode,
        userId,
        totalPrice
      );
      discount = validationResult.discountAmount;
      totalPrice -= discount;
    }

    const order = new this.orderModel({
      ...createOrderDto,
      userId,
      totalPrice,
      orderStatus: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
      discount
    });

    return order.save();
  }

  async findAll(query: any = {}): Promise<{ orders: Order[], total: number }> {
    const { page = 1, limit = 10, ...filters } = query;
    const skip = (page - 1) * limit;

    const orders = await this.orderModel.find(filters)
      .populate('userId', 'email name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await this.orderModel.countDocuments(filters);

    return { orders, total };
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel.findById(id)
      .populate('userId', 'email name')
      .exec();
      
    if (!order) {
      throw new NotFoundException(`Đơn hàng với ID ${id} không tồn tại`);
    }
    
    return order;
  }

  async findByUser(userId: string): Promise<Order[]> {
    return this.orderModel.find({ userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.orderModel.findById(id);
    if (!order) {
      throw new NotFoundException('Đơn hàng không tồn tại');
    }
    
    return this.orderModel.findByIdAndUpdate(
      id,
      updateOrderDto,
      { new: true }
    );
  }

  async updateStatus(id: string, updateStatusDto: UpdateOrderStatusDto) {
    const order = await this.orderModel.findById(id);
    if (!order) {
      throw new NotFoundException(`Đơn hàng với ID ${id} không tồn tại`);
    }

    return this.orderModel.findByIdAndUpdate(
      id,
      { 
        orderStatus: updateStatusDto.status,
        ...(updateStatusDto.cancelReason && { cancelReason: updateStatusDto.cancelReason })
      },
      { new: true }
    );
  }

  async updatePaymentStatus(id: string, updatePaymentStatusDto: UpdatePaymentStatusDto) {
    const order = await this.orderModel.findById(id);
    if (!order) {
      throw new NotFoundException(`Đơn hàng với ID ${id} không tồn tại`);
    }

    const updateData: any = { 
      paymentStatus: updatePaymentStatusDto.paymentStatus 
    };
    
    if (updatePaymentStatusDto.paymentId) {
      updateData.paymentId = updatePaymentStatusDto.paymentId;
    }

    return this.orderModel.findByIdAndUpdate(id, updateData, { new: true });
  }

  async updateTracking(id: string, trackingNumber: string) {
    const order = await this.orderModel.findById(id);
    if (!order) {
      throw new NotFoundException(`Đơn hàng với ID ${id} không tồn tại`);
    }

    return this.orderModel.findByIdAndUpdate(
      id, 
      { trackingNumber }, 
      { new: true }
    );
  }

  async cancelOrder(id: string, cancelReason: string) {
    const order = await this.orderModel.findById(id);
    if (!order) {
      throw new NotFoundException(`Đơn hàng với ID ${id} không tồn tại`);
    }

    if (![OrderStatus.PENDING, OrderStatus.PROCESSING].includes(order.orderStatus)) {
      throw new Error('Không thể hủy đơn hàng ở trạng thái hiện tại');
    }

    return this.orderModel.findByIdAndUpdate(
      id, 
      { 
        orderStatus: OrderStatus.CANCELLED, 
        cancelReason,
        cancelledAt: new Date()
      }, 
      { new: true }
    );
  }

  async requestReturn(id: string, returnData: any) {
    const order = await this.orderModel.findById(id);
    if (!order) {
      throw new NotFoundException(`Đơn hàng với ID ${id} không tồn tại`);
    }

    if (order.orderStatus !== OrderStatus.DELIVERED) {
      throw new Error('Chỉ có thể yêu cầu trả hàng với đơn hàng đã giao');
    }

    return this.orderModel.findByIdAndUpdate(
      id, 
      { 
        orderStatus: OrderStatus.RETURNED,
        returnReason: returnData.reason,
        returnImages: returnData.images,
        returnRequestedAt: new Date()
      }, 
      { new: true }
    );
  }
} 