import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment } from './schemas/payment.schema';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { OrdersService } from '../orders/orders.service';
import { PaymentStatus } from '../orders/enums/order.enum';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    private ordersService: OrdersService
  ) {}

  async create(createPaymentDto: CreatePaymentDto) {
    const { orderId, userId, paymentMethod, returnUrl } = createPaymentDto;
    
    const order = await this.ordersService.findOne(orderId);
    if (!order) {
      throw new NotFoundException('Đơn hàng không tồn tại');
    }

    const payment = await this.paymentModel.create({
      orderId,
      userId,
      amount: order.totalPrice,
      paymentMethod,
      returnUrl
    });

    return payment;
  }

  async findByOrder(orderId: string) {
    return this.paymentModel.findOne({ orderId });
  }

  async updatePaymentStatus(paymentId: string, status: PaymentStatus, transactionId?: string) {
    const payment = await this.paymentModel.findById(paymentId);
    if (!payment) {
      throw new NotFoundException('Không tìm thấy thông tin thanh toán');
    }

    payment.status = status;
    if (transactionId) {
      payment.transactionId = transactionId;
    }
    
    if (status === PaymentStatus.PAID) {
      payment.paidAt = new Date();
    } else if (status === PaymentStatus.REFUNDED) {
      payment.refundedAt = new Date();
    }

    await payment.save();
    await this.ordersService.updatePaymentStatus(payment.orderId.toString(), { paymentStatus: status });

    return payment;
  }
} 