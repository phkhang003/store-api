import { 
  Controller, Get, Post, Body, Param, 
  UseGuards, Query, Patch, Delete 
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
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UserDocument } from '../users/schemas/user.schema';

@ApiTags('reviews')
@Controller('reviews')
@ApiBearerAuth()
@ApiSecurity('x-api-key')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Tạo đánh giá mới' })
  create(
    @GetUser() user: UserDocument,
    @Body() createReviewDto: CreateReviewDto
  ) {
    return this.reviewsService.create(user._id.toString(), createReviewDto);
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'Lấy danh sách đánh giá của sản phẩm' })
  findAll(@Param('productId') productId: string) {
    return this.reviewsService.findAll(productId);
  }

  @Post(':id/reply')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Thêm phản hồi cho đánh giá' })
  addReply(
    @Param('id') id: string,
    @GetUser() user: UserDocument,
    @Body('content') content: string
  ) {
    return this.reviewsService.addReply(id, user._id.toString(), content);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, ApiKeyGuard)
  @Roles([UserRole.CONTENT_ADMIN])
  @ApiOperation({ summary: 'Cập nhật trạng thái đánh giá' })
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string
  ) {
    return this.reviewsService.updateStatus(id, status);
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Thích đánh giá' })
  likeReview(
    @Param('id') id: string,
    @GetUser() user: UserDocument
  ) {
    return this.reviewsService.likeReview(id, user._id.toString());
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lấy danh sách đánh giá của user hiện tại' })
  findByUser(@GetUser() user: UserDocument) {
    return this.reviewsService.findByUser(user._id.toString());
  }

  @Get('pending')
  @UseGuards(JwtAuthGuard, ApiKeyGuard)
  @Roles([UserRole.CONTENT_ADMIN])
  @ApiOperation({ summary: 'Lấy danh sách đánh giá chờ duyệt' })
  findPendingReviews() {
    return this.reviewsService.findPendingReviews();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, ApiKeyGuard)
  @Roles([UserRole.CONTENT_ADMIN])
  @ApiOperation({ summary: 'Xóa đánh giá' })
  delete(@Param('id') id: string) {
    return this.reviewsService.delete(id);
  }
} 