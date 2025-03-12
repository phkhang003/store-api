import { Controller, Get, Post, Body, Param, Put, Query, UseGuards, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam, ApiSecurity, ApiBody } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiKeyGuard } from '../auth/guards/api-key.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../auth/constants/permissions';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { GetCurrentUser } from '../auth/decorators/get-current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { OrderStatus, PaymentStatus } from './enums/order.enum';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { AdminRoute } from '../auth/decorators/admin-route.decorator';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Tạo đơn hàng mới' })
  @ApiResponse({ status: 201, description: 'Đơn hàng đã được tạo thành công.' })
  create(
    @GetCurrentUser() currentUser: JwtPayload,
    @Body() createOrderDto: CreateOrderDto
  ) {
    return this.ordersService.create(createOrderDto, currentUser.sub);
  }

  @Get()
  @ApiBearerAuth()
  @ApiSecurity('x-api-key')
  @UseGuards(JwtAuthGuard, ApiKeyGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.PRODUCT_ADMIN)
  @RequirePermissions(Permission.READ_ORDER)
  @ApiOperation({ summary: 'Lấy danh sách đơn hàng (Admin)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'orderStatus', required: false, enum: OrderStatus })
  @ApiQuery({ name: 'paymentStatus', required: false, enum: PaymentStatus })
  @ApiQuery({ name: 'userId', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Danh sách đơn hàng.' })
  async findAll(@Query() query) {
    return this.ordersService.findAll(query);
  }

  @Get('my-orders')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lấy danh sách đơn hàng của người dùng hiện tại' })
  @ApiResponse({ status: 200, description: 'Danh sách đơn hàng.' })
  findMyOrders(@GetCurrentUser() currentUser: JwtPayload) {
    return this.ordersService.findByUser(currentUser.sub);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lấy thông tin đơn hàng theo ID' })
  @ApiParam({ name: 'id', description: 'ID của đơn hàng' })
  @ApiResponse({ status: 200, description: 'Thông tin đơn hàng.' })
  @ApiResponse({ status: 404, description: 'Đơn hàng không tồn tại.' })
  async findOne(
    @Param('id') id: string,
    @GetCurrentUser() currentUser: JwtPayload
  ) {
    const order = await this.ordersService.findOne(id);
    
    if (currentUser.role === UserRole.USER && order.userId.toString() !== currentUser.sub) {
      throw new ForbiddenException('Bạn không có quyền xem đơn hàng này');
    }
    
    return order;
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiSecurity('x-api-key')
  @UseGuards(JwtAuthGuard, ApiKeyGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.PRODUCT_ADMIN)
  @RequirePermissions(Permission.UPDATE_ORDER)
  @ApiOperation({ summary: 'Cập nhật thông tin đơn hàng' })
  @ApiParam({ name: 'id', description: 'ID của đơn hàng' })
  @ApiResponse({ status: 200, description: 'Đơn hàng đã được cập nhật.' })
  @ApiResponse({ status: 404, description: 'Đơn hàng không tồn tại.' })
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Put(':id/status')
  @AdminRoute(
    [UserRole.SUPER_ADMIN, UserRole.PRODUCT_ADMIN],
    [Permission.UPDATE_ORDER],
    'Cập nhật trạng thái đơn hàng'
  )
  @ApiParam({ name: 'id', description: 'ID của đơn hàng' })
  @ApiResponse({ status: 200, description: 'Trạng thái đơn hàng đã được cập nhật.' })
  @ApiResponse({ status: 404, description: 'Đơn hàng không tồn tại.' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateOrderStatusDto
  ) {
    return this.ordersService.updateStatus(id, updateStatusDto);
  }

  @Put(':id/payment-status')
  @AdminRoute(
    [UserRole.SUPER_ADMIN, UserRole.PRODUCT_ADMIN],
    [Permission.UPDATE_ORDER],
    'Cập nhật trạng thái thanh toán'
  )
  @ApiParam({ name: 'id', description: 'ID của đơn hàng' })
  @ApiResponse({ status: 200, description: 'Trạng thái thanh toán đã được cập nhật.' })
  @ApiResponse({ status: 404, description: 'Đơn hàng không tồn tại.' })
  updatePaymentStatus(
    @Param('id') id: string,
    @Body() updatePaymentStatusDto: UpdatePaymentStatusDto
  ) {
    return this.ordersService.updatePaymentStatus(id, updatePaymentStatusDto);
  }

  @Put(':id/tracking')
  @AdminRoute(
    [UserRole.SUPER_ADMIN, UserRole.PRODUCT_ADMIN],
    [Permission.UPDATE_ORDER],
    'Cập nhật mã vận đơn'
  )
  @ApiParam({ name: 'id', description: 'ID của đơn hàng' })
  @ApiResponse({ status: 200, description: 'Mã vận đơn đã được cập nhật.' })
  @ApiResponse({ status: 404, description: 'Đơn hàng không tồn tại.' })
  updateTracking(
    @Param('id') id: string,
    @Body('trackingNumber') trackingNumber: string
  ) {
    return this.ordersService.updateTracking(id, trackingNumber);
  }

  @Post(':id/cancel')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Hủy đơn hàng' })
  @ApiParam({ name: 'id', description: 'ID của đơn hàng' })
  @ApiResponse({ status: 200, description: 'Đơn hàng đã được hủy.' })
  @ApiResponse({ status: 400, description: 'Không thể hủy đơn hàng ở trạng thái hiện tại.' })
  @ApiResponse({ status: 404, description: 'Đơn hàng không tồn tại.' })
  async cancelOrder(
    @Param('id') id: string,
    @Body('cancelReason') cancelReason: string,
    @GetCurrentUser() currentUser: JwtPayload
  ) {
    const order = await this.ordersService.findOne(id);
    
    if (order.userId.toString() !== currentUser.sub) {
      throw new ForbiddenException('Bạn không có quyền hủy đơn hàng này');
    }
    
    return this.ordersService.cancelOrder(id, cancelReason);
  }

  @Post(':id/return')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Yêu cầu trả hàng' })
  @ApiParam({ name: 'id', description: 'ID của đơn hàng' })
  @ApiResponse({ status: 200, description: 'Yêu cầu trả hàng đã được ghi nhận.' })
  @ApiResponse({ status: 400, description: 'Không thể trả hàng ở trạng thái hiện tại.' })
  @ApiResponse({ status: 404, description: 'Đơn hàng không tồn tại.' })
  async requestReturn(
    @Param('id') id: string,
    @Body() returnData: { reason: string, images?: string[] },
    @GetCurrentUser() currentUser: JwtPayload
  ) {
    const order = await this.ordersService.findOne(id);
    
    if (order.userId.toString() !== currentUser.sub) {
      throw new ForbiddenException('Bạn không có quyền yêu cầu trả hàng cho đơn hàng này');
    }
    
    return this.ordersService.requestReturn(id, returnData);
  }
} 