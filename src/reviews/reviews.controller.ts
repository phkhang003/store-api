import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetCurrentUser } from '../auth/decorators/get-current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post('product/:productId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Tạo đánh giá mới cho sản phẩm' })
  @ApiResponse({ status: 201, description: 'Đánh giá đã được tạo.' })
  create(
    @Param('productId') productId: string,
    @Body() createReviewDto: CreateReviewDto,
    @GetCurrentUser() currentUser: JwtPayload
  ) {
    return this.reviewsService.create(currentUser.sub, productId, createReviewDto);
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'Lấy danh sách đánh giá của sản phẩm' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, enum: ['newest', 'oldest', 'highest', 'lowest', 'helpful'] })
  @ApiQuery({ name: 'rating', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Danh sách đánh giá.' })
  findByProduct(
    @Param('productId') productId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('sort') sort = 'newest',
    @Query('rating') rating?: number
  ) {
    return this.reviewsService.findByProduct(productId, { page, limit, sort, rating });
  }

  @Get('user')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lấy danh sách đánh giá của người dùng hiện tại' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Danh sách đánh giá.' })
  findByUser(
    @GetCurrentUser() currentUser: JwtPayload,
    @Query('page') page = 1,
    @Query('limit') limit = 10
  ) {
    return this.reviewsService.findByUser(currentUser.sub, page, limit);
  }
} 