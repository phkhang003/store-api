import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Brand, BrandDocument } from './schemas/brand.schema';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandsService {
  constructor(
    @InjectModel(Brand.name) private brandModel: Model<BrandDocument>
  ) {}

  async create(createBrandDto: CreateBrandDto): Promise<Brand> {
    const existingBrand = await this.brandModel.findOne({ name: createBrandDto.name });
    if (existingBrand) {
      throw new BadRequestException('Thương hiệu đã tồn tại');
    }
    const brand = new this.brandModel(createBrandDto);
    return brand.save();
  }

  async findAll(query: any = {}): Promise<Brand[]> {
    const { search, limit = 10, page = 1 } = query;
    const filter: any = {};
    
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    return this.brandModel
      .find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }

  async findOne(id: string): Promise<Brand> {
    const brand = await this.brandModel.findById(id);
    if (!brand) {
      throw new NotFoundException('Thương hiệu không tồn tại');
    }
    return brand;
  }

  async update(id: string, updateBrandDto: UpdateBrandDto): Promise<Brand> {
    const brand = await this.brandModel.findByIdAndUpdate(id, updateBrandDto, { new: true });
    if (!brand) {
      throw new NotFoundException('Thương hiệu không tồn tại');
    }
    return brand;
  }

  async remove(id: string): Promise<Brand> {
    const brand = await this.brandModel.findByIdAndDelete(id);
    if (!brand) {
      throw new NotFoundException('Thương hiệu không tồn tại');
    }
    return brand;
  }
}
