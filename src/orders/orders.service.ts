import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema, Types, Connection } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { ProductsService } from '../products/products.service';
import { VouchersService } from '../vouchers/vouchers.service';
import { CartsService } from '../carts/carts.service';
import { ProductNotFoundException, InsufficientStockException } from '../common/exceptions';
import { OrderProductDto } from './dto/order-product.dto';
import { ProductDocument } from '../products/schemas/product.schema';
import { OrderStatus } from '../common/constants/order.constants';
import { PaymentsService } from '../payments/payments.service';
import { PaymentStatus } from '../payments/schemas/payment.schema';
import { CreatePaymentDto } from '../payments/dto/create-payment.dto';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { UserRole } from '../auth/enums/role.enum';
import { UsersService } from '../users/users.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private readonly productsService: ProductsService,
    private readonly vouchersService: VouchersService,
    private readonly cartsService: CartsService,
    private readonly paymentsService: PaymentsService,
    private readonly usersService: UsersService,
    @InjectConnection() private readonly connection: Connection
  ) {}

  async create(userId: string, createOrderDto: CreateOrderDto): Promise<OrderDocument> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      // Thêm validation số lượng tồn kho
      await this.validateInventory(createOrderDto.products);
      
      const { orderProducts, totalPrice } = await this.validateProducts(createOrderDto.products);
      const { voucherData, finalPrice } = await this.validateVoucher(createOrderDto.voucherId, totalPrice);

      // Tạo đơn hàng
      const order = await this.orderModel.create({
        userId: new MongooseSchema.Types.ObjectId(userId),
        products: orderProducts,
        totalPrice,
        voucher: voucherData,
        finalPrice,
        status: OrderStatus.PENDING,
        shippingInfo: createOrderDto.shippingInfo,
        branchId: new MongooseSchema.Types.ObjectId(createOrderDto.branchId)
      });

      // Tạo payment record
      const paymentDto: CreatePaymentDto = {
        orderId: order._id.toString(),
        userId: userId,
        amount: finalPrice,
        method: createOrderDto.paymentMethod,
      };
      
      // Lấy user để lấy email
      const user = await this.usersService.findOne(userId);
      
      const jwtPayload: JwtPayload = {
        sub: userId,
        role: UserRole.USER,
        email: user.email // Lấy email từ user thay vì shipping info
      };
      
      await this.paymentsService.create(paymentDto, jwtPayload);

      // Xóa giỏ hàng
      await this.cartsService.clearCart(userId);

      await session.commitTransaction();
      return order;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async findByUserId(userId: string): Promise<OrderDocument[]> {
    return this.orderModel.find({ 
      userId: new MongooseSchema.Types.ObjectId(userId) 
    })
    .sort({ createdAt: -1 })
    .populate('products.productId', 'name images')
    .exec();
  }

  async findOne(id: string): Promise<OrderDocument> {
    const order = await this.orderModel.findById(id)
      .populate('products.productId', 'name images price')
      .populate('branchId', 'name address')
      .exec();

    if (!order) {
      throw new NotFoundException('Đơn hàng không tồn tại');
    }
    return order;
  }

  async updateStatus(id: string, status: OrderStatus): Promise<OrderDocument> {
    const order = await this.findOne(id);
    
    if (!Object.values(OrderStatus).includes(status)) {
      throw new BadRequestException('Trạng thái đơn hàng không hợp lệ');
    }

    if (order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException('Không thể cập nhật đơn hàng đã hủy');
    }

    if (order.status === OrderStatus.COMPLETED) {
      throw new BadRequestException('Không thể cập nhật đơn hàng đã hoàn thành');
    }

    order.status = status;
    return order.save();
  }

  async findByStatus(status: string): Promise<OrderDocument[]> {
    return this.orderModel.find({ status })
      .sort({ createdAt: -1 })
      .populate('products.productId', 'name images')
      .populate('branchId', 'name address')
      .exec();
  }

  async findByBranch(branchId: string): Promise<OrderDocument[]> {
    return this.orderModel.find({ 
      branchId: new MongooseSchema.Types.ObjectId(branchId) 
    })
      .sort({ createdAt: -1 })
      .populate('products.productId', 'name images')
      .populate('branchId', 'name address')
      .exec();
  }

  async cancelOrder(id: string): Promise<OrderDocument> {
    const order = await this.findOne(id);
    
    if (order.status !== 'pending') {
      throw new BadRequestException('Chỉ có thể hủy đơn hàng đang chờ xử lý');
    }

    order.status = 'cancelled';
    return order.save();
  }

  async completeOrder(id: string): Promise<OrderDocument> {
    const order = await this.findOne(id);
    
    // Kiểm tra payment status
    const payment = await this.paymentsService.findByOrderId(id);
    if (payment.status !== PaymentStatus.COMPLETED) {
      throw new BadRequestException('Không thể hoàn thành đơn hàng chưa thanh toán');
    }
    
    if (order.status !== 'shipped') {
      throw new BadRequestException('Chỉ có thể hoàn thành đơn hàng đang giao');
    }

    order.status = 'completed';
    return order.save();
  }

  private async validateProducts(products: OrderProductDto[]): Promise<{
    orderProducts: any[];
    totalPrice: number;
  }> {
    const orderProducts = [];
    let totalPrice = 0;

    for (const item of products) {
      const product = await this.productsService.findOne(item.productId);
      if (!product) {
        throw new ProductNotFoundException(item.productId);
      }

      const price = await this.calculateProductPrice(product, item);
      totalPrice += price * item.quantity;
      
      orderProducts.push({
        productId: new MongooseSchema.Types.ObjectId(item.productId),
        variantId: item.variantId ? new MongooseSchema.Types.ObjectId(item.variantId) : undefined,
        options: item.options,
        quantity: item.quantity,
        price
      });
    }

    return { orderProducts, totalPrice };
  }

  private async calculateProductPrice(product: ProductDocument, item: OrderProductDto): Promise<number> {
    if (!item.variantId) return product.price;

    const variant = product.variants?.find(
      v => v.variantId.toString() === item.variantId
    );
    if (!variant) {
      throw new NotFoundException(`Biến thể của sản phẩm ${product.name} không tồn tại`);
    }
    return variant.price;
  }

  private async validateVoucher(voucherId: string, totalPrice: number): Promise<{
    voucherData?: any;
    finalPrice: number;
  }> {
    let finalPrice = totalPrice;
    let voucherData;

    if (voucherId) {
      const voucher = await this.vouchersService.findOne(voucherId);
      if (totalPrice < voucher.minimumOrderValue) {
        throw new BadRequestException('Đơn hàng chưa đạt giá trị tối thiểu để áp dụng voucher');
      }

      let discountAmount: number;
      if (voucher.discountType === 'percentage') {
        discountAmount = Math.min(
          voucher.maxDiscount,
          totalPrice * (voucher.discountValue / 100)
        );
      } else {
        discountAmount = Math.min(voucher.discountValue, totalPrice);
      }

      finalPrice = totalPrice - discountAmount;
      voucherData = {
        voucherId: new Types.ObjectId(voucherId),
        discountAmount
      };
    }

    return { voucherData, finalPrice };
  }

  private async validateInventory(products: OrderProductDto[]) {
    for (const item of products) {
      const product = await this.productsService.findOne(item.productId);
      const totalQuantity = product.inventory.reduce((sum, inv) => sum + inv.quantity, 0);
      if (totalQuantity < item.quantity) {
        throw new BadRequestException(`Sản phẩm ${product.name} không đủ số lượng trong kho`);
      }
    }
  }
} 