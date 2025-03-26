import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryDocument> {
    const createdCategory = new this.categoryModel(createCategoryDto);
    return createdCategory.save();
  }

  async findAll(): Promise<CategoryDocument[]> {
    return this.categoryModel.find().sort({ order: 1 }).exec();
  }

  async findOne(id: string): Promise<CategoryDocument> {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException(`Danh mục với ID ${id} không tồn tại`);
    }
    return category;
  }

  async findByParent(parentId: string): Promise<CategoryDocument[]> {
    return this.categoryModel.find({ parentId }).exec();
  }

  async findFeatured(): Promise<CategoryDocument[]> {
    return this.categoryModel.find({ featured: true }).sort({ order: 1 }).exec();
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<CategoryDocument> {
    const category = await this.categoryModel.findById(id);
    if (!category) {
      throw new NotFoundException(`Danh mục với ID ${id} không tồn tại`);
    }
    
    Object.assign(category, updateCategoryDto);
    return category.save();
  }

  async remove(id: string): Promise<CategoryDocument> {
    const category = await this.categoryModel.findById(id);
    if (!category) {
      throw new NotFoundException(`Danh mục với ID ${id} không tồn tại`);
    }

    // Kiểm tra xem có danh mục con không
    const hasChildren = await this.categoryModel.exists({ parentId: id });
    if (hasChildren) {
      throw new BadRequestException('Không thể xóa danh mục có chứa danh mục con');
    }

    return this.categoryModel.findByIdAndDelete(id).exec();
  }

  async updateOrder(id: string, order: number): Promise<CategoryDocument> {
    const category = await this.categoryModel.findById(id);
    if (!category) {
      throw new NotFoundException(`Danh mục với ID ${id} không tồn tại`);
    }
    
    category.order = order;
    return category.save();
  }

  async updateStatus(id: string, status: string): Promise<CategoryDocument> {
    const category = await this.categoryModel.findById(id);
    if (!category) {
      throw new NotFoundException(`Danh mục với ID ${id} không tồn tại`);
    }
    
    category.status = status;
    return category.save();
  }
} 