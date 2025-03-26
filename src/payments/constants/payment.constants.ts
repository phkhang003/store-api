export const PAYMENT_CONSTANTS = {
  MIN_AMOUNT: 1000, // Số tiền tối thiểu (VND)
  MAX_REFUND_ATTEMPTS: 3,
  REFUND_EXPIRY_DAYS: 30,
};

export const PAYMENT_EVENTS = {
  PAYMENT_CREATED: 'payment.created',
  PAYMENT_COMPLETED: 'payment.completed',
  PAYMENT_FAILED: 'payment.failed',
  REFUND_REQUESTED: 'refund.requested',
  REFUND_PROCESSED: 'refund.processed',
  STATUS_UPDATED: 'payment.status.updated'
}; 