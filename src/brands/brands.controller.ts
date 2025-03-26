import { 
  Controller, Get, Post, Body, Param, 
  UseGuards, Query, Put, Delete, Patch 
} from '@nestjs/common';
import { 
  ApiTags, ApiOperation, ApiBearerAuth,
  ApiResponse, ApiSecurity 
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiKeyGuard } from '../auth/guards/api-key.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/enums/role.enum';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { BrandsService } from './brands.service';

@ApiTags('brands')
@Controller('brands')
@ApiBearerAuth()
@ApiSecurity('x-api-key')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, ApiKeyGuard)
  @Roles([UserRole.CONTENT_ADMIN])
  @ApiOperation({ summary: 'Tạo thương hiệu mới' })
  @ApiResponse({ status: 201, description: 'Thương hiệu đã được tạo thành công.' })
  create(@Body(new ValidationPipe()) createBrandDto: CreateBrandDto) {
    return this.brandsService.create(createBrandDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách thương hiệu' })
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return this.brandsService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin thương hiệu theo ID' })
  findOne(@Param('id') id: string) {
    return this.brandsService.findOne(id);
  }

  @Get('search')
  @ApiOperation({ summary: 'Tìm kiếm thương hiệu' })
  search(@Query('keyword') keyword: string) {
    return this.brandsService.search(keyword);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, ApiKeyGuard)
  @Roles([UserRole.CONTENT_ADMIN])
  @ApiOperation({ summary: 'Cập nhật thông tin thương hiệu' })
  update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandsService.update(id, updateBrandDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, ApiKeyGuard)
  @Roles([UserRole.CONTENT_ADMIN])
  @ApiOperation({ summary: 'Xóa thương hiệu' })
  remove(@Param('id') id: string) {
    return this.brandsService.remove(id);
  }
} 