import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { Cart, CartDocument, CartItem } from './schemas/cart.schema';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CartsService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    private readonly productsService: ProductsService,
  ) {}

  async findByUserId(userId: string): Promise<CartDocument> {
    const cart = await this.cartModel.findOne({ 
      userId: new MongooseSchema.Types.ObjectId(userId) 
    })
    .populate('items.productId', 'name images price')
    .exec();
    
    if (!cart) {
      return this.cartModel.create({ 
        userId: new MongooseSchema.Types.ObjectId(userId),
        items: [],
        totalAmount: 0 
      });
    }
    return cart;
  }

  async addItem(userId: string, createCartItemDto: CreateCartItemDto): Promise<CartDocument> {
    const cart = await this.findByUserId(userId);
    const product = await this.productsService.findOne(createCartItemDto.productId);
    
    if (!product) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }

    // Kiểm tra số lượng tồn kho
    const totalQuantity = product.inventory.reduce((sum, inv) => sum + inv.quantity, 0);
    if (totalQuantity < createCartItemDto.quantity) {
      throw new BadRequestException('Số lượng sản phẩm trong kho không đủ');
    }

    // Kiểm tra variant nếu có
    let price = product.price;
    if (createCartItemDto.variantId) {
      const variant = product.variants?.find(
        v => v.variantId.toString() === createCartItemDto.variantId
      );
      if (!variant) {
        throw new NotFoundException('Biến thể sản phẩm không tồn tại');
      }
      price = variant.price;
    }

    const cartItem: CartItem = {
      productId: new MongooseSchema.Types.ObjectId(createCartItemDto.productId),
      variantId: createCartItemDto.variantId ? new MongooseSchema.Types.ObjectId(createCartItemDto.variantId) : undefined,
      quantity: createCartItemDto.quantity,
      selectedOptions: createCartItemDto.selectedOptions,
      price
    };

    // Kiểm tra xem item đã tồn tại trong giỏ hàng chưa
    const existingItemIndex = cart.items.findIndex(
      item => item.productId.toString() === createCartItemDto.productId &&
      item.variantId?.toString() === createCartItemDto.variantId
    );

    if (existingItemIndex > -1) {
      // Cập nhật số lượng nếu item đã tồn tại
      cart.items[existingItemIndex].quantity += createCartItemDto.quantity;
    } else {
      // Thêm item mới
      cart.items.push(cartItem);
    }

    // Tính lại tổng tiền
    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    return cart.save();
  }

  async removeItem(userId: string, productId: string, variantId?: string): Promise<CartDocument> {
    const cart = await this.findByUserId(userId);
    
    cart.items = cart.items.filter(
      item => !(item.productId.toString() === productId && 
        item.variantId?.toString() === variantId)
    );

    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    return cart.save();
  }

  async updateItemQuantity(
    userId: string,
    productId: string,
    quantity: number,
    variantId?: string
  ): Promise<CartDocument> {
    if (quantity < 1) {
      throw new BadRequestException('Số lượng phải lớn hơn 0');
    }

    const cart = await this.findByUserId(userId);
    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId &&
        item.variantId?.toString() === variantId
    );

    if (itemIndex === -1) {
      throw new NotFoundException('Sản phẩm không tồn tại trong giỏ hàng');
    }

    cart.items[itemIndex].quantity = quantity;
    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    return cart.save();
  }

  async clearCart(userId: string): Promise<CartDocument> {
    const cart = await this.findByUserId(userId);
    cart.items = [];
    cart.totalAmount = 0;
    return cart.save();
  }
} 