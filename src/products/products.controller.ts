import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam, ApiBody, ApiSecurity } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../security/guards/jwt-auth.guard';
import { ApiKeyGuard } from '../security/guards/api-key.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator';
import { Permission } from '../auth/constants/permissions';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { SkinType, ProductType } from './constants/product.constants';
import { AdminRoute } from '../auth/decorators/admin-route.decorator';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @AdminRoute(
    [UserRole.SUPER_ADMIN, UserRole.PRODUCT_ADMIN],
    [Permission.CREATE_PRODUCT],
    'Tạo sản phẩm mới'
  )
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách sản phẩm' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Số trang' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Số lượng sản phẩm mỗi trang' })
  @ApiQuery({ name: 'sort', required: false, type: String, description: 'Sắp xếp (ví dụ: price_asc, price_desc, newest)' })
  @ApiQuery({ name: 'category', required: false, type: String, description: 'ID danh mục' })
  @ApiQuery({ name: 'featured', required: false, type: Boolean, description: 'Sản phẩm nổi bật' })
  @ApiQuery({ name: 'new', required: false, type: Boolean, description: 'Sản phẩm mới' })
  @ApiResponse({ status: 200, description: 'Danh sách sản phẩm.' })
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('sort') sort?: string,
    @Query('category') category?: string,
    @Query('featured') featured?: boolean,
    @Query('new') isNew?: boolean
  ) {
    return this.productsService.findAll({
      page,
      limit,
      sort,
      category,
      featured,
      isNew
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết sản phẩm' })
  @ApiParam({ name: 'id', description: 'ID của sản phẩm' })
  @ApiResponse({ status: 200, description: 'Chi tiết sản phẩm.' })
  @ApiResponse({ status: 404, description: 'Sản phẩm không tồn tại.' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Put(':id')
  @AdminRoute(
    [UserRole.SUPER_ADMIN, UserRole.PRODUCT_ADMIN],
    [Permission.UPDATE_PRODUCT],
    'Cập nhật sản phẩm'
  )
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @AdminRoute(
    [UserRole.SUPER_ADMIN, UserRole.PRODUCT_ADMIN],
    [Permission.DELETE_PRODUCT],
    'Xóa sản phẩm'
  )
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @Get('search/query')
  @ApiOperation({ summary: 'Tìm kiếm sản phẩm' })
  @ApiQuery({ name: 'keyword', required: false, type: String, description: 'Từ khóa tìm kiếm' })
  @ApiQuery({ name: 'skinType', required: false, enum: SkinType, description: 'Loại da' })
  @ApiQuery({ name: 'productType', required: false, enum: ProductType, description: 'Loại sản phẩm' })
  @ApiQuery({ name: 'brand', required: false, type: String, description: 'Thương hiệu' })
  @ApiQuery({ name: 'minPrice', required: false, type: Number, description: 'Giá tối thiểu' })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number, description: 'Giá tối đa' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Số trang' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Số lượng sản phẩm mỗi trang' })
  @ApiResponse({ status: 200, description: 'Danh sách sản phẩm tìm kiếm.' })
  search(
    @Query('keyword') keyword?: string,
    @Query('skinType') skinType?: SkinType,
    @Query('productType') productType?: ProductType,
    @Query('brand') brand?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('page') page = 1,
    @Query('limit') limit = 10
  ) {
    return this.productsService.search({
      keyword,
      skinType,
      productType,
      brand,
      minPrice,
      maxPrice,
      page,
      limit
    });
  }
} 