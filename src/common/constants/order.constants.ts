export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  PAYMENT_FAILED = 'payment_failed'
}

// Xóa dòng gây lỗi
// export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS]; 