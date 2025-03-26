import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Brand } from './schemas/brand.schema';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandsService {
  constructor(
    @InjectModel(Brand.name) private brandModel: Model<Brand>
  ) {}

  async create(createBrandDto: CreateBrandDto): Promise<Brand> {
    const brand = new this.brandModel(createBrandDto);
    return brand.save();
  }

  async findAll(page: number = 1, limit: number = 10): Promise<Brand[]> {
    const skip = (page - 1) * limit;
    return this.brandModel
      .find()
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async findOne(id: string): Promise<Brand> {
    const brand = await this.brandModel.findById(id);
    if (!brand) {
      throw new NotFoundException(`Thương hiệu với ID ${id} không tồn tại`);
    }
    return brand;
  }

  async update(id: string, updateBrandDto: UpdateBrandDto): Promise<Brand> {
    const updatedBrand = await this.brandModel
      .findByIdAndUpdate(id, updateBrandDto, { new: true })
      .exec();
    
    if (!updatedBrand) {
      throw new NotFoundException('Thương hiệu không tồn tại');
    }
    return updatedBrand;
  }

  async remove(id: string): Promise<Brand> {
    const deletedBrand = await this.brandModel.findByIdAndDelete(id);
    if (!deletedBrand) {
      throw new NotFoundException('Thương hiệu không tồn tại');
    }
    return deletedBrand;
  }

  async search(keyword: string): Promise<Brand[]> {
    return this.brandModel
      .find({
        $text: { $search: keyword }
      })
      .sort({ score: { $meta: 'textScore' } })
      .exec();
  }
} 