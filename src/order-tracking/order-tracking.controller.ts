import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiKeyGuard } from '../auth/guards/api-key.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/enums/role.enum';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { OrderTrackingService } from './order-tracking.service';
import { CreateTrackingDto } from './dto/create-tracking.dto';

@ApiTags('order-tracking')
@Controller('order-tracking')
@UseGuards(JwtAuthGuard, ApiKeyGuard)
@ApiBearerAuth()
@ApiSecurity('x-api-key')
export class OrderTrackingController {
  constructor(private readonly orderTrackingService: OrderTrackingService) {}

  @Post()
  @Roles([UserRole.STAFF, UserRole.ADMIN, UserRole.SUPER_ADMIN])
  @ApiOperation({ summary: 'Cập nhật trạng thái đơn hàng' })
  create(@GetUser('_id') userId: string, @Body() createTrackingDto: CreateTrackingDto) {
    return this.orderTrackingService.create(userId, createTrackingDto);
  }

  @Get(':orderId')
  @ApiOperation({ summary: 'Lấy thông tin vận chuyển của đơn hàng' })
  findByOrder(@Param('orderId') orderId: string) {
    return this.orderTrackingService.findByOrder(orderId);
  }
} 