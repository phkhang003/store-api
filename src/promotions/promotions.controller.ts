import { Controller, Post, Get, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiBearerAuth, ApiSecurity, ApiParam, ApiQuery } from '@nestjs/swagger';
import { PromotionsService } from './promotions.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiKeyGuard } from '../auth/guards/api-key.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../auth/constants/permissions';

@ApiTags('promotions')
@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Post()
  @ApiBearerAuth()
  @ApiSecurity('x-api-key')
  @UseGuards(JwtAuthGuard, ApiKeyGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.PRODUCT_ADMIN)
  @RequirePermissions(Permission.MANAGE_PROMOTIONS)
  @ApiOperation({ summary: 'Tạo mã khuyến mãi mới' })
  @ApiBody({
    type: CreatePromotionDto,
    description: 'Thông tin mã khuyến mãi mới'
  })
  @ApiResponse({ status: 201, description: 'Mã khuyến mãi đã được tạo thành công.' })
  create(@Body() createPromotionDto: CreatePromotionDto) {
    return this.promotionsService.create(createPromotionDto);
  }

  @Get('validate/:code')
  @ApiOperation({ summary: 'Kiểm tra tính hợp lệ của mã khuyến mãi' })
  @ApiParam({ name: 'code', description: 'Mã khuyến mãi' })
  @ApiQuery({ name: 'userId', required: false, type: String, description: 'ID người dùng' })
  @ApiQuery({ name: 'orderValue', required: true, type: Number, description: 'Giá trị đơn hàng' })
  @ApiResponse({ status: 200, description: 'Thông tin mã khuyến mãi.' })
  @ApiResponse({ status: 404, description: 'Mã khuyến mãi không tồn tại hoặc không hợp lệ.' })
  validate(
    @Param('code') code: string,
    @Query('userId') userId?: string,
    @Query('orderValue') orderValue?: number
  ) {
    return this.promotionsService.validate(code, userId, orderValue);
  }
} 