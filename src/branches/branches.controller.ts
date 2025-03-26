import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/enums/role.enum';

@ApiTags('branches')
@Controller('branches')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiSecurity('x-api-key')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Post()
  @Roles([UserRole.SUPER_ADMIN])
  @ApiOperation({ summary: 'Tạo chi nhánh mới' })
  @ApiResponse({ status: 201, description: 'Tạo chi nhánh thành công' })
  create(@Body() createBranchDto: CreateBranchDto) {
    return this.branchesService.create(createBranchDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách chi nhánh' })
  findAll() {
    return this.branchesService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Tìm kiếm chi nhánh' })
  search(@Query('keyword') keyword: string) {
    return this.branchesService.search(keyword);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi nhánh' })
  findOne(@Param('id') id: string) {
    return this.branchesService.findOne(id);
  }

  @Patch(':id')
  @Roles([UserRole.SUPER_ADMIN])
  @ApiOperation({ summary: 'Cập nhật thông tin chi nhánh' })
  update(@Param('id') id: string, @Body() updateBranchDto: UpdateBranchDto) {
    return this.branchesService.update(id, updateBranchDto);
  }

  @Delete(':id')
  @Roles([UserRole.SUPER_ADMIN])
  @ApiOperation({ summary: 'Xóa chi nhánh' })
  remove(@Param('id') id: string) {
    return this.branchesService.remove(id);
  }
} 