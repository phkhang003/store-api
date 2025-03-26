import { PaymentMethod, PaymentStatus } from '../schemas/payment.schema';

export interface IPaymentDetails {
  cardLast4?: string;
  bankName?: string;
  accountNumber?: string;
}

export interface IRefundHistory {
  amount: number;
  reason: string;
  status: string;
  processedAt: Date;
}

export interface IPayment {
  orderId: string;
  userId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  paymentDetails?: IPaymentDetails;
  refundHistory?: IRefundHistory[];
} 