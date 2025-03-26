import { Controller, Get, Post, Body, Delete, Param, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CartsService } from './carts.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UserDocument } from '../users/schemas/user.schema';
import { Cart } from './schemas/cart.schema';

@ApiTags('carts')
@Controller('carts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy thông tin giỏ hàng của user' })
  @ApiResponse({ 
    status: 200,
    description: 'Lấy giỏ hàng thành công',
    type: Cart
  })
  async getCart(@GetUser() user: UserDocument) {
    return this.cartsService.findByUserId(user._id.toString());
  }

  @Post('items')
  @ApiOperation({ summary: 'Thêm sản phẩm vào giỏ hàng' })
  @ApiResponse({ 
    status: 201,
    description: 'Thêm sản phẩm vào giỏ hàng thành công',
    type: Cart
  })
  @ApiResponse({ 
    status: 404,
    description: 'Sản phẩm không tồn tại'
  })
  async addToCart(
    @GetUser() user: UserDocument,
    @Body() createCartItemDto: CreateCartItemDto
  ) {
    return this.cartsService.addItem(user._id.toString(), createCartItemDto);
  }

  @Delete('items/:productId')
  @ApiOperation({ summary: 'Xóa sản phẩm khỏi giỏ hàng' })
  async removeFromCart(
    @GetUser() user: UserDocument,
    @Param('productId') productId: string,
    @Body('variantId') variantId?: string
  ) {
    return this.cartsService.removeItem(user._id.toString(), productId, variantId);
  }

  @Put('items/:productId/quantity')
  @ApiOperation({ summary: 'Cập nhật số lượng sản phẩm trong giỏ hàng' })
  async updateQuantity(
    @GetUser() user: UserDocument,
    @Param('productId') productId: string,
    @Body('quantity') quantity: number,
    @Body('variantId') variantId?: string
  ) {
    return this.cartsService.updateItemQuantity(user._id.toString(), productId, quantity, variantId);
  }

  @Delete()
  @ApiOperation({ summary: 'Xóa toàn bộ giỏ hàng' })
  async clearCart(@GetUser() user: UserDocument) {
    return this.cartsService.clearCart(user._id.toString());
  }
} 