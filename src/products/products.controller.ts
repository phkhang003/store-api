import { 
    Controller, Get, Post, Body, Patch, Param, Delete,
    UseGuards, Query
  } from '@nestjs/common';
  import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiSecurity, ApiParam } from '@nestjs/swagger';
  import { ProductsService } from './products.service';
  import { CreateProductDto } from './dto/create-product.dto';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { ApiKeyGuard } from '../auth/guards/api-key.guard';
  import { Roles } from '../auth/decorators/roles.decorator';
  import { UserRole } from '../auth/enums/role.enum';
  import { SearchProductDto } from './dto/search-product.dto';
  import { UpdateStockDto } from './dto/update-stock.dto';
  import { UpdatePriceDto } from './dto/update-price.dto';
  import { ValidationPipe } from '@nestjs/common';
  import { ApiKeyAuth } from '../auth/decorators/api-key.decorator';
  import { Logger } from '@nestjs/common';
  
  @ApiTags('products')
  @Controller('products')
  @ApiBearerAuth()
  export class ProductsController {
    private readonly logger = new Logger(ProductsController.name);
  
    constructor(private readonly productsService: ProductsService) {}
  
    @Post()
    @ApiKeyAuth({ 
      roles: [UserRole.PRODUCT_ADMIN],
      limit: 10, 
      ttlSeconds: 60 
    })
    @ApiOperation({ summary: 'Tạo sản phẩm mới' })
    async create(@Body() createProductDto: CreateProductDto) {
      try {
        return await this.productsService.create(createProductDto);
      } catch (error) {
        this.logger.error('Lỗi khi tạo sản phẩm:', { 
          message: error.message,
          productDto: createProductDto 
        });
        throw error;
      }
    }
  
    @Get()
    @ApiOperation({ summary: 'Lấy danh sách sản phẩm' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    findAll(
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 10
    ) {
      return this.productsService.findAll(page, limit);
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Lấy thông tin sản phẩm theo ID' })
    findOne(@Param('id') id: string) {
      return this.productsService.findOne(id);
    }
  
    @Patch(':id')
    @UseGuards(JwtAuthGuard, ApiKeyGuard)
    @Roles([UserRole.PRODUCT_ADMIN])
    update(@Param('id') id: string, @Body() updateProductDto: Partial<CreateProductDto>) {
      return this.productsService.update(id, updateProductDto);
    }
  
    @Delete(':id')
    @UseGuards(JwtAuthGuard, ApiKeyGuard)
    @Roles([UserRole.PRODUCT_ADMIN])
    remove(@Param('id') id: string) {
      return this.productsService.remove(id);
    }
  
    @Get('search')
    @ApiOperation({ summary: 'Tìm kiếm sản phẩm' })
    @ApiQuery({ name: 'keyword', required: false })
    @ApiQuery({ name: 'categoryId', required: false })
    @ApiQuery({ name: 'brandId', required: false })
    @ApiQuery({ name: 'minPrice', required: false, type: Number })
    @ApiQuery({ name: 'maxPrice', required: false, type: Number })
    search(@Query() searchDto: SearchProductDto) {
      return this.productsService.searchProducts(searchDto);
    }
  
    @Get('category/:categoryId')
    @ApiOperation({ summary: 'Lấy sản phẩm theo danh mục' })
    @ApiParam({ name: 'categoryId', description: 'ID của danh mục' })
    findByCategory(@Param('categoryId') categoryId: string) {
      return this.productsService.findByCategory(categoryId);
    }
  
    @Get('brand/:brandId')
    @ApiOperation({ summary: 'Lấy sản phẩm theo thương hiệu' })
    @ApiParam({ name: 'brandId', description: 'ID của thương hiệu' })
    findByBrand(@Param('brandId') brandId: string) {
      return this.productsService.findByBrand(brandId);
    }
  
    @Patch(':id/stock')
    @ApiKeyAuth({
      roles: [UserRole.PRODUCT_ADMIN],
      limit: 10,
      ttlSeconds: 60
    })
    @ApiOperation({ summary: 'Cập nhật số lượng tồn kho' })
    updateStock(
      @Param('id') id: string,
      @Body() updateStockDto: UpdateStockDto
    ) {
      return this.productsService.updateStock(id, updateStockDto.quantity);
    }
  
    @Patch(':id/price')
    @UseGuards(JwtAuthGuard, ApiKeyGuard)
    @Roles([UserRole.PRODUCT_ADMIN])
    @ApiOperation({ summary: 'Cập nhật giá sản phẩm' })
    updatePrice(
      @Param('id') id: string,
      @Body() updatePriceDto: UpdatePriceDto
    ) {
      return this.productsService.updatePrice(id, updatePriceDto.price);
    }
  }