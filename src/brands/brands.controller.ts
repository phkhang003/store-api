import { Controller, Get, Post, Body, Put, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiSecurity, ApiParam, ApiBody } from '@nestjs/swagger';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiKeyGuard } from '../auth/guards/api-key.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { UserRole } from '../auth/enums/role.enum';
import { Permission } from '../auth/constants/permissions';
import { AdminRoute } from '../auth/decorators/admin-route.decorator';

@ApiTags('brands')
@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  @AdminRoute(
    [UserRole.SUPER_ADMIN, UserRole.PRODUCT_ADMIN],
    [Permission.CREATE_BRAND]
  )
  @ApiOperation({ summary: 'Tạo thương hiệu mới' })
  @ApiBody({
    type: CreateBrandDto,
    description: 'Thông tin thương hiệu mới',
    examples: {
      example1: {
        summary: 'Thương hiệu mỹ phẩm',
        value: {
          name: 'The Ordinary',
          description: 'Thương hiệu mỹ phẩm với công thức đơn giản và hiệu quả',
          image: 'the-ordinary.jpg'
        }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Thương hiệu đã được tạo thành công.' })
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandsService.create(createBrandDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách thương hiệu' })
  findAll(@Query() query: any) {
    return this.brandsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin thương hiệu theo ID' })
  findOne(@Param('id') id: string) {
    return this.brandsService.findOne(id);
  }

  @Put(':id')
  @AdminRoute(
    [UserRole.SUPER_ADMIN, UserRole.PRODUCT_ADMIN],
    [Permission.UPDATE_BRAND]
  )
  @ApiOperation({ summary: 'Cập nhật thông tin thương hiệu' })
  update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandsService.update(id, updateBrandDto);
  }

  @Delete(':id')
  @AdminRoute(
    [UserRole.SUPER_ADMIN, UserRole.PRODUCT_ADMIN],
    [Permission.DELETE_BRAND]
  )
  @ApiOperation({ summary: 'Xóa thương hiệu' })
  remove(@Param('id') id: string) {
    return this.brandsService.remove(id);
  }
}
