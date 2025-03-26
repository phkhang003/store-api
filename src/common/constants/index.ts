export const ORDER_STATUS = {
  PENDING: 'pending',
  SHIPPED: 'shipped',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const;

export const PRODUCT_STATUS = {
  ACTIVE: 'active',
  OUT_OF_STOCK: 'out_of_stock',
  DISCONTINUED: 'discontinued'
} as const; 