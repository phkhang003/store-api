import { 
    Controller, Get, Post, Body, Patch, Param, Delete, 
    Query, UseGuards 
  } from '@nestjs/common';
  import { 
    ApiTags, ApiOperation, ApiBearerAuth, 
    ApiResponse, ApiSecurity 
  } from '@nestjs/swagger';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { ApiKeyGuard } from '../auth/guards/api-key.guard';
  import { Roles } from '../auth/decorators/roles.decorator';
  import { UserRole } from '../auth/enums/role.enum';
  import { GetUser } from '../auth/decorators/get-user.decorator';
  import { VouchersService } from './vouchers.service';
  import { CreateVoucherDto } from './dto/create-voucher.dto';
  import { UpdateVoucherDto } from './dto/update-voucher.dto';
  import { UserDocument } from '../users/schemas/user.schema';
  
  @ApiTags('vouchers')
  @Controller('vouchers')
  @ApiBearerAuth()
  @ApiSecurity('x-api-key')
  export class VouchersController {
    constructor(private readonly vouchersService: VouchersService) {}
  
    @Post()
    @UseGuards(JwtAuthGuard, ApiKeyGuard)
    @Roles([UserRole.MARKETING_ADMIN])
    @ApiOperation({ summary: 'Tạo voucher mới' })
    create(@Body() createVoucherDto: CreateVoucherDto) {
      return this.vouchersService.create(createVoucherDto);
    }
  
    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Lấy danh sách voucher' })
    findAll() {
      return this.vouchersService.findAll();
    }
  
    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Lấy thông tin voucher theo ID' })
    findOne(@Param('id') id: string) {
      return this.vouchersService.findOne(id);
    }
  
    @Get('code/:code')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Lấy thông tin voucher theo mã' })
    findByCode(@Param('code') code: string) {
      return this.vouchersService.findByCode(code);
    }
  
    @Patch(':id')
    @UseGuards(JwtAuthGuard, ApiKeyGuard)
    @Roles([UserRole.MARKETING_ADMIN])
    @ApiOperation({ summary: 'Cập nhật thông tin voucher' })
    update(@Param('id') id: string, @Body() updateVoucherDto: UpdateVoucherDto) {
      return this.vouchersService.update(id, updateVoucherDto);
    }
  
    @Delete(':id')
    @UseGuards(JwtAuthGuard, ApiKeyGuard)
    @Roles([UserRole.MARKETING_ADMIN])
    @ApiOperation({ summary: 'Xóa voucher' })
    remove(@Param('id') id: string) {
      return this.vouchersService.remove(id);
    }
  
    @Post(':id/use')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Sử dụng voucher' })
    useVoucher(
      @Param('id') id: string,
      @GetUser() user: UserDocument
    ) {
      return this.vouchersService.useVoucher(id, user._id.toString());
    }
  }