export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing', 
  SHIPPING = 'shipping',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  COMPLETED = 'completed',
  RETURNED = 'returned',
  CANCELLED = 'cancelled'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded'
} 