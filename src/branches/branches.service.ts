import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Branch, BranchDocument } from './schemas/branch.schema';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

@Injectable()
export class BranchesService {
  constructor(
    @InjectModel(Branch.name) private branchModel: Model<BranchDocument>
  ) {}

  async create(createBranchDto: CreateBranchDto): Promise<BranchDocument> {
    const createdBranch = new this.branchModel(createBranchDto);
    return createdBranch.save();
  }

  async findAll(): Promise<BranchDocument[]> {
    return this.branchModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<BranchDocument> {
    const branch = await this.branchModel.findById(id);
    if (!branch) {
      throw new NotFoundException('Chi nhánh không tồn tại');
    }
    return branch;
  }

  async update(id: string, updateBranchDto: UpdateBranchDto): Promise<BranchDocument> {
    const updatedBranch = await this.branchModel
      .findByIdAndUpdate(id, updateBranchDto, { new: true })
      .exec();
    
    if (!updatedBranch) {
      throw new NotFoundException('Chi nhánh không tồn tại');
    }
    return updatedBranch;
  }

  async remove(id: string): Promise<BranchDocument> {
    const deletedBranch = await this.branchModel.findByIdAndDelete(id);
    if (!deletedBranch) {
      throw new NotFoundException('Chi nhánh không tồn tại');
    }
    return deletedBranch;
  }

  async search(keyword: string): Promise<BranchDocument[]> {
    return this.branchModel
      .find({
        $text: { $search: keyword }
      })
      .sort({ score: { $meta: 'textScore' } })
      .exec();
  }
} 