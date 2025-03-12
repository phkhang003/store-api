import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { UpdateInventoryDto, InventoryOperation } from './dto/update-inventory.dto';
import { InventoryLog, InventoryLogDocument } from './schemas/inventory-log.schema';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(InventoryLog.name) private inventoryLogModel: Model<InventoryLogDocument>
  ) {}

  async checkInventory(productId: string) {
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException(`Sản phẩm với ID ${productId} không tồn tại`);
    }

    return {
      productId,
      name: product.name,
      stockQuantity: product.stockQuantity,
      isInStock: product.stockQuantity > 0
    };
  }

  async updateInventory(productId: string, updateInventoryDto: UpdateInventoryDto) {
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException(`Sản phẩm với ID ${productId} không tồn tại`);
    }

    let newStock: number;
    const { stock, operation, reason } = updateInventoryDto;

    switch (operation) {
      case InventoryOperation.ADD:
        newStock = product.stockQuantity + stock;
        break;
      case InventoryOperation.SUBTRACT:
        newStock = Math.max(0, product.stockQuantity - stock);
        break;
      case InventoryOperation.SET:
        newStock = stock;
        break;
      default:
        newStock = product.stockQuantity;
    }

    // Cập nhật số lượng trong kho
    const updatedProduct = await this.productModel.findByIdAndUpdate(
      productId,
      { stockQuantity: newStock },
      { new: true }
    );

    // Ghi log cập nhật kho
    await this.inventoryLogModel.create({
      productId,
      previousStock: product.stockQuantity,
      newStock,
      operation,
      quantity: stock,
      reason: reason || `Cập nhật kho: ${operation}`
    });

    return {
      productId,
      name: updatedProduct.name,
      previousStock: product.stockQuantity,
      currentStock: newStock,
      operation
    };
  }
} 