import { Controller, Get, Put, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse, ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiKeyGuard } from '../auth/guards/api-key.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { Permission } from '../auth/constants/permissions';

@ApiTags('inventory')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get(':productId')
  @ApiOperation({ summary: 'Kiểm tra số lượng tồn kho' })
  @ApiParam({ name: 'productId', description: 'ID của sản phẩm' })
  @ApiResponse({ status: 200, description: 'Thông tin tồn kho.' })
  @ApiResponse({ status: 404, description: 'Sản phẩm không tồn tại.' })
  checkInventory(@Param('productId') productId: string) {
    return this.inventoryService.checkInventory(productId);
  }

  @Put(':productId')
  @ApiBearerAuth()
  @ApiSecurity('x-api-key')
  @UseGuards(JwtAuthGuard, ApiKeyGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.PRODUCT_ADMIN)
  @RequirePermissions(Permission.UPDATE_INVENTORY)
  @ApiOperation({ summary: 'Cập nhật kho hàng' })
  @ApiParam({ name: 'productId', description: 'ID của sản phẩm' })
  @ApiBody({
    type: UpdateInventoryDto,
    description: 'Thông tin cập nhật kho hàng',
    examples: {
      example1: {
        summary: 'Thêm hàng vào kho',
        value: {
          stock: 50,
          operation: 'add',
          reason: 'Nhập hàng mới'
        }
      },
      example2: {
        summary: 'Giảm hàng trong kho',
        value: {
          stock: 10,
          operation: 'subtract',
          reason: 'Hàng bị lỗi'
        }
      },
      example3: {
        summary: 'Đặt lại số lượng',
        value: {
          stock: 100,
          operation: 'set',
          reason: 'Kiểm kê lại kho'
        }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Kho hàng đã được cập nhật.' })
  @ApiResponse({ status: 404, description: 'Sản phẩm không tồn tại.' })
  updateInventory(
    @Param('productId') productId: string,
    @Body() updateInventoryDto: UpdateInventoryDto
  ) {
    return this.inventoryService.updateInventory(
      productId,
      updateInventoryDto
    );
  }
} 