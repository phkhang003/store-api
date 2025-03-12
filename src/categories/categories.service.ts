import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
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
    // Kiểm tra tên danh mục đã tồn tại chưa
    const existingCategory = await this.categoryModel.findOne({ name: createCategoryDto.name });
    if (existingCategory) {
      throw new ConflictException('Tên danh mục đã tồn tại');
    }

    // Kiểm tra danh mục cha nếu có
    if (createCategoryDto.parentId) {
      const parentCategory = await this.categoryModel.findById(createCategoryDto.parentId);
      if (!parentCategory) {
        throw new NotFoundException('Danh mục cha không tồn tại');
      }
    }

    const newCategory = new this.categoryModel(createCategoryDto);
    return newCategory.save();
  }

  async findAll(query: any = {}): Promise<CategoryDocument[]> {
    const { isActive } = query;
    const filter: any = {};
    
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }
    
    return this.categoryModel.find(filter).exec();
  }

  async findOne(id: string): Promise<CategoryDocument> {
    const category = await this.categoryModel.findById(id);
    if (!category) {
      throw new NotFoundException('Danh mục không tồn tại');
    }
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<CategoryDocument> {
    // Kiểm tra tên danh mục đã tồn tại chưa (nếu có cập nhật tên)
    if (updateCategoryDto.name) {
      const existingCategory = await this.categoryModel.findOne({ 
        name: updateCategoryDto.name,
        _id: { $ne: id }
      });
      
      if (existingCategory) {
        throw new ConflictException('Tên danh mục đã tồn tại');
      }
    }

    // Kiểm tra danh mục cha nếu có cập nhật
    if (updateCategoryDto.parentId) {
      // Không cho phép đặt chính nó làm cha
      if (updateCategoryDto.parentId === id) {
        throw new ConflictException('Không thể đặt chính danh mục này làm danh mục cha');
      }
      
      const parentCategory = await this.categoryModel.findById(updateCategoryDto.parentId);
      if (!parentCategory) {
        throw new NotFoundException('Danh mục cha không tồn tại');
      }
    }

    const updatedCategory = await this.categoryModel.findByIdAndUpdate(
      id,
      updateCategoryDto,
      { new: true }
    );
    
    if (!updatedCategory) {
      throw new NotFoundException('Danh mục không tồn tại');
    }
    
    return updatedCategory;
  }

  async remove(id: string): Promise<{ message: string }> {
    // Kiểm tra xem có danh mục con không
    const childCategories = await this.categoryModel.find({ parentId: id });
    if (childCategories.length > 0) {
      throw new ConflictException('Không thể xóa danh mục có chứa danh mục con');
    }
    
    const result = await this.categoryModel.findByIdAndDelete(id);
    
    if (!result) {
      throw new NotFoundException('Danh mục không tồn tại');
    }
    
    return { message: 'Xóa danh mục thành công' };
  }

  async toggleActive(id: string): Promise<CategoryDocument> {
    const category = await this.categoryModel.findById(id);
    
    if (!category) {
      throw new NotFoundException('Danh mục không tồn tại');
    }
    
    category.isActive = !category.isActive;
    return category.save();
  }

  async getChildCategories(parentId: string): Promise<CategoryDocument[]> {
    return this.categoryModel.find({ parentId }).exec();
  }
} 