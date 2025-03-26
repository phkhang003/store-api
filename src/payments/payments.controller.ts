import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetCurrentUser } from '../auth/decorators/get-current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiSecurity } from '@nestjs/swagger';
import { UseInterceptors } from '@nestjs/common';
import { PaymentLoggingInterceptor } from './interceptors/payment-logging.interceptor';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/enums/role.enum';
import { PaymentStatus } from './schemas/payment.schema';
import { OrdersService } from '../orders/orders.service';
import { OrderStatus } from '../orders/enums/order-status.enum';

@ApiTags('payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(PaymentLoggingInterceptor)
@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly ordersService: OrdersService
  ) {}

  @Post()
  @ApiOperation({ summary: 'Tạo thanh toán mới' })
  create(
    @Body() createPaymentDto: CreatePaymentDto,
    @GetCurrentUser() user: JwtPayload
  ) {
    return this.paymentsService.create(createPaymentDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách thanh toán' })
  findAll(@GetCurrentUser() user: JwtPayload) {
    return this.paymentsService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết thanh toán' })
  findOne(
    @Param('id') id: string,
    @GetCurrentUser() user: JwtPayload
  ) {
    return this.paymentsService.findOne(id, user);
  }

  @Post(':id/refund')
  @ApiOperation({ summary: 'Yêu cầu hoàn tiền' })
  refund(
    @Param('id') id: string,
    @Body('amount') amount: number,
    @Body('reason') reason: string,
    @GetCurrentUser() user: JwtPayload
  ) {
    return this.paymentsService.processRefund(id, amount, reason, user);
  }

  @Post(':id/verify')
  @ApiOperation({ summary: 'Xác nhận thanh toán' })
  @Roles([UserRole.SUPER_ADMIN])
  async verifyPayment(
    @Param('id') id: string,
    @Body('transactionId') transactionId: string
  ) {
    return this.paymentsService.updatePaymentStatus(
      id,
      PaymentStatus.COMPLETED,
      transactionId
    );
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Thống kê thanh toán' })
  @Roles([UserRole.SUPER_ADMIN])
  async getStatistics() {
    return this.paymentsService.getPaymentStatistics();
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Webhook cho payment gateway' })
  @ApiSecurity('x-api-key')
  async handlePaymentWebhook(@Body() webhookData: any) {
    const { orderId, status, transactionId } = webhookData;
    
    if (status === 'success') {
      await this.paymentsService.updatePaymentStatus(
        orderId, 
        PaymentStatus.COMPLETED,
        transactionId
      );
      await this.ordersService.updateStatus(orderId, 'confirmed' as OrderStatus);
    } else if (status === 'failed') {
      await this.paymentsService.updatePaymentStatus(
        orderId,
        PaymentStatus.FAILED
      );
      await this.ordersService.updateStatus(orderId, 'payment_failed' as OrderStatus);
    }
    
    return { success: true };
  }
}