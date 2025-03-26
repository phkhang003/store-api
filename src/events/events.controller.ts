import { 
  Controller, Get, Post, Body, Param, Delete, 
  Put, UseGuards, Query 
} from '@nestjs/common';
import { 
  ApiTags, ApiOperation, ApiBearerAuth, 
  ApiResponse, ApiSecurity 
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiKeyGuard } from '../auth/guards/api-key.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/enums/role.enum';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { SearchEventDto } from './dto/search-event.dto';

@ApiTags('events')
@Controller('events')
@ApiBearerAuth()
@ApiSecurity('x-api-key')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, ApiKeyGuard)
  @Roles([UserRole.MARKETING_ADMIN])
  @ApiOperation({ summary: 'Tạo sự kiện mới' })
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả sự kiện' })
  findAll() {
    return this.eventsService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Lấy danh sách sự kiện đang diễn ra' })
  findActive() {
    return this.eventsService.findActive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết sự kiện' })
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, ApiKeyGuard)
  @Roles([UserRole.MARKETING_ADMIN])
  @ApiOperation({ summary: 'Cập nhật thông tin sự kiện' })
  update(
    @Param('id') id: string,
    @Body() updateEventDto: CreateEventDto
  ) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, ApiKeyGuard)
  @Roles([UserRole.MARKETING_ADMIN])
  @ApiOperation({ summary: 'Xóa sự kiện' })
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }

  @Get('search')
  @ApiOperation({ summary: 'Tìm kiếm sự kiện' })
  search(@Query() searchEventDto: SearchEventDto) {
    return this.eventsService.search(searchEventDto);
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'Lấy danh sách sự kiện của sản phẩm' })
  findByProduct(@Param('productId') productId: string) {
    return this.eventsService.findByProduct(productId);
  }
} 