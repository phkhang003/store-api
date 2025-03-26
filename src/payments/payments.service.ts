import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument, PaymentStatus } from './schemas/payment.schema';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';
import { ERROR_MESSAGES } from '../constants/error-messages';
import { PAYMENT_EVENTS } from './constants/payment.constants';
import { PAYMENT_CONSTANTS } from './constants/payment.constants';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    private eventEmitter: EventEmitter2,
    private configService: ConfigService,
  ) {}

  async create(createPaymentDto: CreatePaymentDto, user: JwtPayload) {
    const payment = new this.paymentModel({
      ...createPaymentDto,
      userId: user.sub,
      status: PaymentStatus.PENDING
    });
    return payment.save();
  }

  async findAll(user: JwtPayload) {
    return this.paymentModel.find({ userId: user.sub })
      .populate('orderId')
      .sort({ createdAt: -1 });
  }

  async findOne(id: string, user: JwtPayload) {
    const payment = await this.paymentModel.findOne({ 
      _id: id, 
      userId: user.sub 
    }).populate('orderId');

    if (!payment) {
      throw new NotFoundException(ERROR_MESSAGES.PAYMENT_NOT_FOUND);
    }

    return payment;
  }

  async processRefund(
    id: string, 
    amount: number, 
    reason: string,
    user: JwtPayload
  ) {
    const payment = await this.findOne(id, user);

    if (payment.status !== PaymentStatus.COMPLETED) {
      throw new BadRequestException(ERROR_MESSAGES.PAYMENT_NOT_COMPLETED);
    }

    if (amount > payment.amount) {
      throw new BadRequestException(ERROR_MESSAGES.INVALID_REFUND_AMOUNT);
    }

    payment.refundHistory.push({
      amount,
      reason,
      status: 'pending',
      processedAt: new Date()
    });

    payment.status = PaymentStatus.REFUNDED;
    return payment.save();
  }

  async updatePaymentStatus(id: string, status: PaymentStatus, transactionId?: string) {
    const payment = await this.paymentModel.findById(id);
    if (!payment) {
      throw new NotFoundException(ERROR_MESSAGES.PAYMENT_NOT_FOUND);
    }

    payment.status = status;
    if (transactionId) {
      payment.transactionId = transactionId;
    }

    await payment.save();

    // Emit payment event
    this.eventEmitter.emit(
      status === PaymentStatus.COMPLETED ? PAYMENT_EVENTS.PAYMENT_COMPLETED : PAYMENT_EVENTS.PAYMENT_FAILED,
      payment
    );

    return payment;
  }

  async validateRefund(payment: PaymentDocument, amount: number) {
    if (payment.status !== PaymentStatus.COMPLETED) {
      throw new BadRequestException(ERROR_MESSAGES.PAYMENT_NOT_COMPLETED);
    }

    if (amount <= 0 || amount > payment.amount) {
      throw new BadRequestException(ERROR_MESSAGES.INVALID_REFUND_AMOUNT);
    }

    const refundExpiry = new Date();
    refundExpiry.setDate(refundExpiry.getDate() - PAYMENT_CONSTANTS.REFUND_EXPIRY_DAYS);

    if (payment.createdAt < refundExpiry) {
      throw new BadRequestException('Đã quá thời hạn hoàn tiền');
    }

    if (payment.refundHistory.length >= PAYMENT_CONSTANTS.MAX_REFUND_ATTEMPTS) {
      throw new BadRequestException('Đã vượt quá số lần hoàn tiền cho phép');
    }
  }

  async getPaymentStatistics() {
    const stats = await this.paymentModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    return {
      totalPayments: stats.reduce((acc, curr) => acc + curr.count, 0),
      totalAmount: stats.reduce((acc, curr) => acc + curr.totalAmount, 0),
      byStatus: stats.reduce((acc, curr) => ({
        ...acc,
        [curr._id]: {
          count: curr.count,
          amount: curr.totalAmount
        }
      }), {})
    };
  }

  async findByOrderId(orderId: string): Promise<PaymentDocument> {
    const payment = await this.paymentModel.findOne({ orderId });
    if (!payment) {
      throw new NotFoundException(ERROR_MESSAGES.PAYMENT_NOT_FOUND);
    }
    return payment;
  }

  async handlePaymentStatus(orderId: string, status: PaymentStatus) {
    const payment = await this.findByOrderId(orderId);
    if (!payment) {
      throw new NotFoundException(ERROR_MESSAGES.PAYMENT_NOT_FOUND);
    }

    payment.status = status;
    await payment.save();

    this.eventEmitter.emit(PAYMENT_EVENTS.STATUS_UPDATED, { 
      orderId, 
      status,
      paymentId: payment._id 
    });
  }
}