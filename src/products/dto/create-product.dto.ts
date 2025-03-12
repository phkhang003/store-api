import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsArray, IsBoolean, IsOptional, Min, IsObject, IsEnum, IsUrl, IsDateString, IsMongoId } from 'class-validator';

export enum SkinType {
  ALL = 'all',
  DRY = 'dry',
  OILY = 'oily',
  COMBINATION = 'combination',
  SENSITIVE = 'sensitive',
  NORMAL = 'normal'
}

export enum ProductType {
  CLEANSER = 'cleanser',
  TONER = 'toner',
  SERUM = 'serum',
  MOISTURIZER = 'moisturizer',
  SUNSCREEN = 'sunscreen',
  MASK = 'mask',
  MAKEUP = 'makeup',
  LIPSTICK = 'lipstick',
  FOUNDATION = 'foundation',
  PERFUME = 'perfume',
  HAIRCARE = 'haircare',
  BODYCARE = 'bodycare'
}

export class CreateProductDto {
  @ApiProperty({
    description: 'Tên sản phẩm',
    example: 'Kem dưỡng ẩm Hyaluronic Acid'
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Mô tả ngắn sản phẩm',
    example: 'Kem dưỡng ẩm chuyên sâu với thành phần Hyaluronic Acid'
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Mô tả chi tiết sản phẩm',
    example: 'Kem dưỡng ẩm chuyên sâu với thành phần Hyaluronic Acid giúp cấp ẩm tức thì, phục hồi da khô ráp, làm dịu da kích ứng và tăng cường hàng rào bảo vệ da.',
    required: false
  })
  @IsString()
  @IsOptional()
  detailedDescription?: string;

  @ApiProperty({
    description: 'Giá sản phẩm (VNĐ)',
    example: 450000
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Phần trăm giảm giá',
    example: 10,
    required: false
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  discountPercentage?: number;

  @ApiProperty({
    description: 'Số lượng trong kho',
    example: 100
  })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({
    description: 'Trạng thái sản phẩm',
    example: true,
    required: false
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    description: 'Sản phẩm nổi bật',
    example: false,
    required: false
  })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @ApiProperty({
    description: 'Sản phẩm mới',
    example: true,
    required: false
  })
  @IsBoolean()
  @IsOptional()
  isNew?: boolean;

  @ApiProperty({
    description: 'Danh mục sản phẩm',
    example: ['Chăm sóc da', 'Kem dưỡng'],
    type: [String]
  })
  @IsArray()
  @IsString({ each: true })
  categories: string[];

  @ApiProperty({
    description: 'Đường dẫn hình ảnh sản phẩm',
    example: ['cream1.jpg', 'cream2.jpg'],
    type: [String],
    required: false
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiProperty({
    description: 'ID thương hiệu',
    example: '60d21b4667d0d8992e610c85'
  })
  @IsMongoId()
  brandId: string;

  @ApiProperty({
    description: 'Xuất xứ thương hiệu',
    example: 'Hàn Quốc',
    required: false
  })
  @IsString()
  @IsOptional()
  origin?: string;

  @ApiProperty({
    description: 'Loại da phù hợp',
    enum: SkinType,
    example: SkinType.ALL,
    required: false
  })
  @IsEnum(SkinType)
  @IsOptional()
  skinType?: SkinType;

  @ApiProperty({
    description: 'Loại sản phẩm',
    enum: ProductType,
    example: ProductType.MOISTURIZER,
    required: false
  })
  @IsEnum(ProductType)
  @IsOptional()
  productType?: ProductType;

  @ApiProperty({
    description: 'Dung tích',
    example: '50ml',
    required: false
  })
  @IsString()
  @IsOptional()
  volume?: string;

  @ApiProperty({
    description: 'Thành phần nổi bật',
    example: ['Hyaluronic Acid', 'Glycerin', 'Vitamin E'],
    type: [String],
    required: false
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  keyIngredients?: string[];

  @ApiProperty({
    description: 'Thành phần đầy đủ',
    example: 'Aqua, Glycerin, Hyaluronic Acid, Tocopherol, Panthenol...',
    required: false
  })
  @IsString()
  @IsOptional()
  fullIngredients?: string;

  @ApiProperty({
    description: 'Hướng dẫn sử dụng',
    example: 'Thoa đều lên da mặt sau khi rửa mặt, sáng và tối',
    required: false
  })
  @IsString()
  @IsOptional()
  usage?: string;

  @ApiProperty({
    description: 'Hạn sử dụng',
    example: '36 tháng kể từ ngày sản xuất',
    required: false
  })
  @IsString()
  @IsOptional()
  expiry?: string;

  @ApiProperty({
    description: 'Ngày sản xuất',
    example: '2023-01-01',
    required: false
  })
  @IsDateString()
  @IsOptional()
  manufacturingDate?: string;

  @ApiProperty({
    description: 'Chứng nhận',
    example: ['KFDA', 'Cruelty-free'],
    type: [String],
    required: false
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  certifications?: string[];

  @ApiProperty({
    description: 'Video hướng dẫn',
    example: 'https://youtube.com/watch?v=example',
    required: false
  })
  @IsUrl()
  @IsOptional()
  videoUrl?: string;

  @ApiProperty({
    description: 'Thông tin bổ sung',
    example: {
      pHValue: '5.5',
      allergies: 'Không chứa cồn, paraben',
      suitableFor: 'Mọi loại da, kể cả da nhạy cảm',
      benefits: ['Cấp ẩm', 'Làm dịu', 'Phục hồi da']
    },
    required: false
  })
  @IsObject()
  @IsOptional()
  specifications?: Record<string, any>;
} 