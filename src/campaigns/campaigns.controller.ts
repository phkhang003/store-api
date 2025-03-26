import { 
  Controller, Get, Post, Body, Patch, Param, Delete, 
  Query, UseGuards, Logger 
} from '@nestjs/common';
import { 
  ApiTags, ApiOperation, ApiBearerAuth, 
  ApiResponse, ApiSecurity, ApiParam 
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiKeyGuard } from '../auth/guards/api-key.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/enums/role.enum';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { SearchCampaignDto } from './dto/search-campaign.dto';

@ApiTags('campaigns')
@Controller('campaigns')
@ApiBearerAuth()
@ApiSecurity('x-api-key')
export class CampaignsController {
  private readonly logger = new Logger(CampaignsController.name);
  
  constructor(private readonly campaignsService: CampaignsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, ApiKeyGuard)
  @Roles([UserRole.MARKETING_ADMIN])
  @ApiOperation({ summary: 'Tạo chiến dịch mới' })
  create(@Body() createCampaignDto: CreateCampaignDto) {
    return this.campaignsService.create(createCampaignDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách chiến dịch' })
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return this.campaignsService.findAll(page, limit);
  }

  @Get('active')
  @ApiOperation({ summary: 'Lấy danh sách chiến dịch đang hoạt động' })
  findActive() {
    return this.campaignsService.findActive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chiến dịch theo ID' })
  findOne(@Param('id') id: string) {
    return this.campaignsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, ApiKeyGuard)
  @Roles([UserRole.MARKETING_ADMIN])
  @ApiOperation({ summary: 'Cập nhật thông tin chiến dịch' })
  update(@Param('id') id: string, @Body() updateCampaignDto: UpdateCampaignDto) {
    return this.campaignsService.update(id, updateCampaignDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, ApiKeyGuard)
  @Roles([UserRole.MARKETING_ADMIN])
  @ApiOperation({ summary: 'Xóa chiến dịch' })
  remove(@Param('id') id: string) {
    return this.campaignsService.remove(id);
  }

  @Get('search')
  @ApiOperation({ summary: 'Tìm kiếm chiến dịch' })
  async search(@Query() searchCampaignDto: SearchCampaignDto) {
    try {
      return await this.campaignsService.search(searchCampaignDto);
    } catch (error) {
      this.logger.error(`Lỗi khi tìm kiếm chiến dịch: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'Lấy chiến dịch theo sản phẩm' })
  @ApiParam({ name: 'productId', description: 'ID của sản phẩm' })
  async findByProduct(@Param('productId') productId: string) {
    try {
      return await this.campaignsService.findByProduct(productId);
    } catch (error) {
      this.logger.error(`Lỗi khi lấy chiến dịch theo sản phẩm: ${error.message}`, error.stack);
      throw error;
    }
  }
} 