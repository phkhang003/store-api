export const ERROR_MESSAGES = {
  JWT_NOT_CONFIGURED: 'JWT_SECRET không được cấu hình trong file .env',
  INVALID_API_KEY: 'API key không hợp lệ',
  USER_NOT_FOUND: 'User không tồn tại',
  INVALID_ADMIN_ROLE: 'Tài khoản không có quyền admin',
  PAYMENT_NOT_FOUND: 'Không tìm thấy thanh toán',
  PAYMENT_ALREADY_REFUNDED: 'Thanh toán này đã được hoàn tiền',
  INVALID_REFUND_AMOUNT: 'Số tiền hoàn lại không hợp lệ',
  PAYMENT_NOT_COMPLETED: 'Chỉ có thể hoàn tiền cho các thanh toán đã hoàn thành',
  // ...
}; 