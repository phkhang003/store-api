import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AdminRoute } from '../auth/decorators/admin-route.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { Permission } from '../auth/constants/permissions';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @AdminRoute(
    [UserRole.SUPER_ADMIN, UserRole.CONTENT_ADMIN],
    [Permission.CREATE_CONTENT],
    'Tạo danh mục mỹ phẩm mới'
  )
  @ApiBody({
    type: CreateCategoryDto,
    description: 'Thông tin danh mục mỹ phẩm mới',
    examples: {
      example1: {
        summary: 'Danh mục chính - Chăm sóc da',
        value: {
          name: 'Chăm sóc da',
          description: 'Các sản phẩm chăm sóc da mặt',
          isActive: true,
          image: 'skincare.jpg',
          icon: 'fa-skincare',
          order: 1,
          isFeatured: true
        }
      },
      example2: {
        summary: 'Danh mục con - Kem dưỡng',
        value: {
          name: 'Kem dưỡng',
          description: 'Các loại kem dưỡng da mặt',
          isActive: true,
          parentId: '60d21b4667d0d8992e610c85',
          image: 'moisturizer.jpg',
          icon: 'fa-cream',
          order: 2
        }
      },
      example3: {
        summary: 'Danh mục chính - Trang điểm',
        value: {
          name: 'Trang điểm',
          description: 'Các sản phẩm trang điểm',
          isActive: true,
          image: 'makeup.jpg',
          icon: 'fa-makeup',
          order: 3,
          isFeatured: true
        }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Danh mục đã được tạo thành công.' })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách danh mục' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Danh sách danh mục.' })
  findAll(@Query() query) {
    return this.categoriesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin danh mục theo ID' })
  @ApiParam({ name: 'id', description: 'ID của danh mục' })
  @ApiResponse({ status: 200, description: 'Thông tin danh mục.' })
  @ApiResponse({ status: 404, description: 'Danh mục không tồn tại.' })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Get(':id/children')
  @ApiOperation({ summary: 'Lấy danh sách danh mục con' })
  @ApiParam({ name: 'id', description: 'ID của danh mục cha' })
  @ApiResponse({ status: 200, description: 'Danh sách danh mục con.' })
  getChildCategories(@Param('id') id: string) {
    return this.categoriesService.getChildCategories(id);
  }

  @Put(':id')
  @AdminRoute(
    [UserRole.SUPER_ADMIN, UserRole.CONTENT_ADMIN],
    [Permission.UPDATE_CONTENT],
    'Cập nhật thông tin danh mục'
  )
  @ApiParam({ name: 'id', description: 'ID của danh mục' })
  @ApiResponse({ status: 200, description: 'Danh mục đã được cập nhật.' })
  @ApiResponse({ status: 404, description: 'Danh mục không tồn tại.' })
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @AdminRoute(
    [UserRole.SUPER_ADMIN, UserRole.CONTENT_ADMIN],
    [Permission.DELETE_CONTENT],
    'Xóa danh mục'
  )
  @ApiParam({ name: 'id', description: 'ID của danh mục' })
  @ApiResponse({ status: 200, description: 'Danh mục đã được xóa.' })
  @ApiResponse({ status: 404, description: 'Danh mục không tồn tại.' })
  @ApiResponse({ status: 409, description: 'Không thể xóa danh mục có chứa danh mục con.' })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }

  @Put(':id/toggle-active')
  @AdminRoute(
    [UserRole.SUPER_ADMIN, UserRole.CONTENT_ADMIN],
    [Permission.UPDATE_CONTENT],
    'Bật/tắt trạng thái danh mục'
  )
  @ApiParam({ name: 'id', description: 'ID của danh mục' })
  @ApiResponse({ status: 200, description: 'Trạng thái danh mục đã được cập nhật.' })
  @ApiResponse({ status: 404, description: 'Danh mục không tồn tại.' })
  toggleActive(@Param('id') id: string) {
    return this.categoriesService.toggleActive(id);
  }
} 