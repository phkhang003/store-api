import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, UnauthorizedException, NotFoundException, Headers, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiHeader, ApiParam } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, AddressDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/enums/role.enum';
import { GetCurrentUser } from '../auth/decorators/get-current-user.decorator';
import { AuthService } from '../auth/auth.service';
import { UserResponse } from './interfaces/user.interface';
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator';
import { Permission, RolePermissions } from '../auth/constants/permissions';
import { ApiKeyGuard } from '../auth/guards/api-key.guard';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { ApiKeyAuth } from '../auth/decorators/api-key.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User, UserDocument } from './schemas/user.schema';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, ApiKeyGuard)
@Roles([UserRole.SUPER_ADMIN])
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách users' })
  @ApiHeader({
    name: 'x-api-key',
    description: 'API key for admin authentication',
    required: true
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách users',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string' },
          role: { type: 'string', enum: ['USER', 'ADMIN'] },
          isActive: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  })
  async findAll(@Headers('x-api-key') apiKey: string) {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lấy thông tin người dùng theo ID' })
  @ApiParam({ name: 'id', description: 'ID của người dùng' })
  @ApiResponse({ status: 200, description: 'Thông tin người dùng.' })
  @ApiResponse({ status: 404, description: 'Người dùng không tồn tại.' })
  findOne(@Param('id') id: string, @GetCurrentUser() currentUser: JwtPayload) {
    // Chỉ cho phép xem thông tin của chính mình hoặc admin
    if (id !== currentUser.sub && currentUser.role !== 'SUPER_ADMIN') {
      throw new UnauthorizedException('Không có quyền truy cập thông tin người dùng này');
    }
    return this.usersService.findById(id);
  }

  @Put(':id')
  @RequirePermissions(Permission.UPDATE_USER)
  @ApiOperation({ summary: 'Admin cập nhật thông tin user' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: CreateUserDto
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Put(':id/status')
  @RequirePermissions(Permission.UPDATE_USER)
  @ApiOperation({ summary: 'Vô hiệu hóa/Kích hoạt tài khoản user' })
  @ApiResponse({ status: 200, description: 'Trạng thái user đã được cập nhật' })
  @ApiResponse({ status: 404, description: 'User không tồn tại' })
  async toggleUserStatus(
    @Param('id') id: string,
    @GetCurrentUser() currentUser: JwtPayload
  ) {
    return this.usersService.toggleUserStatus(id, currentUser);
  }

  @Post('register')
  @ApiOperation({ summary: 'Đăng ký người dùng mới' })
  @ApiBody({
    type: CreateUserDto,
    description: 'Thông tin đăng ký người dùng',
    examples: {
      example1: {
        summary: 'Đăng ký người dùng',
        value: {
          name: 'Nguyễn Văn A',
          email: 'nguyenvana@example.com',
          password: 'password123',
          phone: '0987654321'
        }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Người dùng đã được tạo thành công.' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ hoặc email đã tồn tại.' })
  register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lấy thông tin người dùng hiện tại' })
  getProfile(@GetUser() user: UserDocument) {
    return this.usersService.findById(user._id.toString());
  }

  @Put('profile')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Cập nhật thông tin người dùng hiện tại' })
  @ApiBody({
    type: UpdateUserDto,
    description: 'Thông tin cập nhật người dùng',
    examples: {
      example1: {
        summary: 'Cập nhật thông tin',
        value: {
          name: 'Nguyễn Văn A',
          phone: '0987654321',
          address: {
            street: 'Số 123, Đường Nguyễn Huệ',
            city: 'Hồ Chí Minh',
            district: 'Quận 1',
            ward: 'Bến Nghé'
          }
        }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Thông tin người dùng đã được cập nhật.' })
  @ApiResponse({ status: 401, description: 'Không có quyền truy cập.' })
  updateProfile(
    @GetCurrentUser() currentUser: JwtPayload,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.usersService.update(currentUser.sub, updateUserDto);
  }

  @Get('wishlist')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lấy danh sách yêu thích' })
  getWishlist(@GetUser() user: UserDocument) {
    return this.usersService.findById(user._id.toString());
  }

  @Post('wishlist/:productId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Thêm sản phẩm vào danh sách yêu thích' })
  addToWishlist(
    @GetUser() user: UserDocument,
    @Param('productId') productId: string
  ) {
    return this.usersService.addToWishlist(user._id.toString(), productId);
  }

  @Delete('wishlist/:productId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Xóa sản phẩm khỏi danh sách yêu thích' })
  removeFromWishlist(
    @GetUser() user: UserDocument,
    @Param('productId') productId: string
  ) {
    return this.usersService.removeFromWishlist(user._id.toString(), productId);
  }

  @Post('addresses')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Thêm địa chỉ mới' })
  addAddress(
    @GetUser() user: UserDocument,
    @Body() address: AddressDto
  ) {
    return this.usersService.addAddress(user._id.toString(), address);
  }

  @Patch('addresses/:addressId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Cập nhật địa chỉ' })
  updateAddress(
    @GetUser() user: UserDocument,
    @Param('addressId') addressId: string,
    @Body() address: AddressDto
  ) {
    return this.usersService.updateAddress(user._id.toString(), addressId, address);
  }

  @Delete('addresses/:addressId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Xóa địa chỉ' })
  removeAddress(
    @GetUser() user: UserDocument,
    @Param('addressId') addressId: string
  ) {
    return this.usersService.removeAddress(user._id.toString(), addressId);
  }
}
