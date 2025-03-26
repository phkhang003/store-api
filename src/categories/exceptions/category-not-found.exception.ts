import { NotFoundException } from '@nestjs/common';

export class CategoryNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Danh mục với ID ${id} không tồn tại`);
  }
} 