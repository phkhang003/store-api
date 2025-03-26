import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Patch,
  UseGuards,
  Logger
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UserDocument } from '../users/schemas/user.schema';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/enums/role.enum';
import { OrderStatus } from './enums/order-status.enum';

@ApiTags('orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiSecurity('x-api-key')
export class OrdersController {
  private readonly logger = new Logger(OrdersController.name);

  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo đơn hàng mới' })
  @ApiResponse({ status: 201, description: 'Đơn hàng đã được tạo thành công' })
  async create(
    @GetUser() user: UserDocument,
    @Body() createOrderDto: CreateOrderDto
  ) {
    try {
      return await this.ordersService.create(user._id.toString(), createOrderDto);
    } catch (error) {
      this.logger.error(`Lỗi khi tạo đơn hàng: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách đơn hàng của user' })
  async findByUser(@GetUser() user: UserDocument) {
    return this.ordersService.findByUserId(user._id.toString());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết đơn hàng' })
  async findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id/status')
  @Roles([UserRole.SUPER_ADMIN])
  @ApiOperation({ summary: 'Cập nhật trạng thái đơn hàng' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: OrderStatus
  ) {
    return this.ordersService.updateStatus(id, status);
  }

  @Get('status/:status')
  @Roles([UserRole.SUPER_ADMIN])
  @ApiOperation({ summary: 'Lấy danh sách đơn hàng theo trạng thái' })
  async findByStatus(@Param('status') status: string) {
    return this.ordersService.findByStatus(status);
  }

  @Get('branch/:branchId')
  @Roles([UserRole.SUPER_ADMIN])
  @ApiOperation({ summary: 'Lấy danh sách đơn hàng theo chi nhánh' })
  async findByBranch(@Param('branchId') branchId: string) {
    return this.ordersService.findByBranch(branchId);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Hủy đơn hàng' })
  async cancelOrder(
    @Param('id') id: string,
    @GetUser() user: UserDocument
  ) {
    return this.ordersService.cancelOrder(id);
  }

  @Post(':id/complete')
  @Roles([UserRole.SUPER_ADMIN])
  @ApiOperation({ summary: 'Hoàn thành đơn hàng' })
  async completeOrder(@Param('id') id: string) {
    return this.ordersService.completeOrder(id);
  }
} 