import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Voucher, VoucherDocument } from './schemas/voucher.schema';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';

@Injectable()
export class VouchersService {
  constructor(
    @InjectModel(Voucher.name) private voucherModel: Model<VoucherDocument>
  ) {}

  async create(createVoucherDto: CreateVoucherDto): Promise<VoucherDocument> {
    await this.validateVoucherDates(createVoucherDto.startDate, createVoucherDto.endDate);
    await this.validateVoucherCode(createVoucherDto.code);

    if (createVoucherDto.discountType === 'percentage' && createVoucherDto.discountValue > 100) {
      throw new BadRequestException('Giảm giá theo phần trăm không thể vượt quá 100%');
    }

    const voucher = new this.voucherModel(createVoucherDto);
    return voucher.save();
  }

  async findAll(page: number = 1, limit: number = 10): Promise<VoucherDocument[]> {
    const skip = (page - 1) * limit;
    return this.voucherModel
      .find()
      .populate(['applicableProducts', 'applicableCategories'])
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<VoucherDocument> {
    const voucher = await this.voucherModel
      .findById(id)
      .populate(['applicableProducts', 'applicableCategories'])
      .exec();
      
    if (!voucher) {
      throw new NotFoundException('Voucher không tồn tại');
    }
    return voucher;
  }

  async findByCode(code: string): Promise<VoucherDocument> {
    const voucher = await this.voucherModel
      .findOne({ code: code.toUpperCase() })
      .populate(['applicableProducts', 'applicableCategories'])
      .exec();
      
    if (!voucher) {
      throw new NotFoundException('Voucher không tồn tại');
    }
    return voucher;
  }

  async update(id: string, updateVoucherDto: UpdateVoucherDto): Promise<VoucherDocument> {
    if (updateVoucherDto.startDate && updateVoucherDto.endDate) {
      await this.validateVoucherDates(updateVoucherDto.startDate, updateVoucherDto.endDate);
    }

    if (updateVoucherDto.code) {
      await this.validateVoucherCode(updateVoucherDto.code, id);
    }

    const voucher = await this.voucherModel
      .findByIdAndUpdate(id, updateVoucherDto, { new: true })
      .exec();

    if (!voucher) {
      throw new NotFoundException('Voucher không tồn tại');
    }
    return voucher;
  }

  async remove(id: string): Promise<VoucherDocument> {
    const voucher = await this.voucherModel.findByIdAndDelete(id);
    if (!voucher) {
      throw new NotFoundException('Voucher không tồn tại');
    }
    return voucher;
  }

  async validateVoucherDates(startDate: Date, endDate: Date): Promise<void> {
    if (endDate <= startDate) {
      throw new BadRequestException('Ngày kết thúc phải sau ngày bắt đầu');
    }

    const now = new Date();
    if (startDate < now) {
      throw new BadRequestException('Ngày bắt đầu không thể trong quá khứ');
    }
  }

  async validateVoucherCode(code: string, excludeId?: string): Promise<void> {
    const query = { code: code.toUpperCase() };
    if (excludeId) {
      Object.assign(query, { _id: { $ne: excludeId } });
    }

    const existingVoucher = await this.voucherModel.findOne(query);
    if (existingVoucher) {
      throw new BadRequestException('Mã voucher đã tồn tại');
    }
  }

  async useVoucher(voucherId: string, userId: string): Promise<VoucherDocument> {
    const voucher = await this.findOne(voucherId);
    
    if (!voucher.isActive) {
      throw new BadRequestException('Voucher không còn hiệu lực');
    }

    if (voucher.usedCount >= voucher.usageLimit) {
      throw new BadRequestException('Voucher đã hết lượt sử dụng');
    }

    const userObjectId = new Types.ObjectId(userId);
    if (voucher.usedByUsers.some(id => id.toString() === userObjectId.toString())) {
      throw new BadRequestException('Bạn đã sử dụng voucher này');
    }

    const now = new Date();
    if (now < voucher.startDate || now > voucher.endDate) {
      throw new BadRequestException('Voucher không trong thời gian sử dụng');
    }

    voucher.usedCount += 1;
    voucher.usedByUsers.push(userObjectId as any);
    return voucher.save();
  }
} 