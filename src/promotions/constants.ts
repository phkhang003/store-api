export enum PromotionType {
  FIXED = 'fixed',
  PERCENTAGE = 'percentage',
  FREE_SHIPPING = 'free_shipping',
  FREE_PRODUCT = 'free_product'
}

export const PROMOTION_MESSAGES = {
  NOT_FOUND: 'Mã khuyến mãi không tồn tại hoặc đã hết hạn',
  EXPIRED: 'Mã khuyến mãi chưa bắt đầu hoặc đã kết thúc',
  MAX_USAGE_REACHED: 'Mã khuyến mãi đã hết lượt sử dụng',
  FIRST_ORDER_ONLY: 'Mã khuyến mãi chỉ áp dụng cho đơn hàng đầu tiên',
  MIN_ORDER_VALUE: 'Giá trị đơn hàng chưa đạt mức tối thiểu',
  ALREADY_USED: 'Bạn đã sử dụng mã khuyến mãi này rồi',
  APPLIED_SUCCESS: 'Áp dụng mã khuyến mãi thành công'
}; 