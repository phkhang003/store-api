import { Controller, Get, Post, Body, Param, UseGuards, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiKeyGuard } from '../auth/guards/api-key.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/enums/role.enum';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ValidationPipe } from '../common/pipes/validation.pipe';

@ApiTags('categories')
@Controller('categories')
@ApiBearerAuth()
@ApiSecurity('x-api-key')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, ApiKeyGuard)
  @Roles([UserRole.CONTENT_ADMIN])
  @ApiOperation({ summary: 'Tạo danh mục mới' })
  @ApiResponse({ status: 201, description: 'Danh mục đã được tạo thành công.' })
  create(@Body(new ValidationPipe()) createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách danh mục' })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin danh mục theo ID' })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Get('parent/:parentId')
  @ApiOperation({ summary: 'Lấy danh sách danh mục con' })
  findByParent(@Param('parentId') parentId: string) {
    return this.categoriesService.findByParent(parentId);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Lấy danh sách danh mục nổi bật' })
  findFeatured() {
    return this.categoriesService.findFeatured();
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, ApiKeyGuard)
  @Roles([UserRole.CONTENT_ADMIN])
  @ApiOperation({ summary: 'Cập nhật thông tin danh mục' })
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, ApiKeyGuard)
  @Roles([UserRole.CONTENT_ADMIN])
  @ApiOperation({ summary: 'Xóa danh mục' })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }

  @Patch(':id/order')
  @UseGuards(JwtAuthGuard, ApiKeyGuard)
  @Roles([UserRole.CONTENT_ADMIN])
  @ApiOperation({ summary: 'Cập nhật thứ tự danh mục' })
  updateOrder(
    @Param('id') id: string,
    @Body('order') order: number
  ) {
    return this.categoriesService.updateOrder(id, order);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, ApiKeyGuard)
  @Roles([UserRole.CONTENT_ADMIN])
  @ApiOperation({ summary: 'Cập nhật trạng thái danh mục' })
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string
  ) {
    return this.categoriesService.updateStatus(id, status);
  }
} 