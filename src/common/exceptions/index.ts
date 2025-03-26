import { NotFoundException, BadRequestException } from './base.exception';

export class ProductNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Sản phẩm với ID ${id} không tồn tại`);
  }
}

export class BranchNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Chi nhánh với ID ${id} không tồn tại`);
  }
}

export class InsufficientStockException extends BadRequestException {
  constructor(productName: string) {
    super(`Sản phẩm ${productName} không đủ số lượng trong kho`);
  }
}

export class OrderNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Đơn hàng với ID ${id} không tồn tại`);
  }
}

export class InvalidOrderStatusException extends BadRequestException {
  constructor(status: string) {
    super(`Trạng thái đơn hàng ${status} không hợp lệ`);
  }
} 