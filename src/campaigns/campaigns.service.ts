import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Campaign, CampaignDocument } from './schemas/campaign.schema';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { SearchCampaignDto } from './dto/search-campaign.dto';

@Injectable()
export class CampaignsService {
  private readonly logger = new Logger(CampaignsService.name);

  constructor(
    @InjectModel(Campaign.name) private campaignModel: Model<CampaignDocument>
  ) {}

  async create(createCampaignDto: CreateCampaignDto): Promise<Campaign> {
    if (createCampaignDto.endDate <= createCampaignDto.startDate) {
      throw new BadRequestException('Ngày kết thúc phải sau ngày bắt đầu');
    }

    const campaign = new this.campaignModel(createCampaignDto);
    return campaign.save();
  }

  async findAll(page: number = 1, limit: number = 10): Promise<Campaign[]> {
    const skip = (page - 1) * limit;
    return this.campaignModel
      .find()
      .populate('products.productId')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();
  }

  async findActive(): Promise<Campaign[]> {
    const now = new Date();
    return this.campaignModel
      .find({
        startDate: { $lte: now },
        endDate: { $gte: now }
      })
      .populate('products.productId')
      .exec();
  }

  async findOne(id: string): Promise<Campaign> {
    const campaign = await this.campaignModel
      .findById(id)
      .populate('products.productId')
      .exec();
      
    if (!campaign) {
      throw new NotFoundException('Chiến dịch không tồn tại');
    }
    return campaign;
  }

  async update(id: string, updateCampaignDto: UpdateCampaignDto): Promise<Campaign> {
    if (updateCampaignDto.endDate && updateCampaignDto.startDate && 
        updateCampaignDto.endDate <= updateCampaignDto.startDate) {
      throw new BadRequestException('Ngày kết thúc phải sau ngày bắt đầu');
    }

    const campaign = await this.campaignModel
      .findByIdAndUpdate(id, updateCampaignDto, { new: true })
      .exec();

    if (!campaign) {
      throw new NotFoundException('Chiến dịch không tồn tại');
    }
    return campaign;
  }

  async remove(id: string): Promise<Campaign> {
    const campaign = await this.campaignModel.findByIdAndDelete(id);
    if (!campaign) {
      throw new NotFoundException('Chiến dịch không tồn tại');
    }
    return campaign;
  }

  async search(searchCampaignDto: SearchCampaignDto): Promise<CampaignDocument[]> {
    const query: any = {};

    if (searchCampaignDto.keyword) {
      query.$text = { $search: searchCampaignDto.keyword };
    }

    if (searchCampaignDto.type) {
      query.type = searchCampaignDto.type;
    }

    if (searchCampaignDto.startDate || searchCampaignDto.endDate) {
      query.$and = [];
      
      if (searchCampaignDto.startDate) {
        query.$and.push({ startDate: { $gte: new Date(searchCampaignDto.startDate) } });
      }
      
      if (searchCampaignDto.endDate) {
        query.$and.push({ endDate: { $lte: new Date(searchCampaignDto.endDate) } });
      }
    }

    return this.campaignModel
      .find(query)
      .populate('products.productId')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByProduct(productId: string): Promise<CampaignDocument[]> {
    const now = new Date();
    return this.campaignModel
      .find({
        'products.productId': productId,
        startDate: { $lte: now },
        endDate: { $gte: now }
      })
      .exec();
  }

  async validateCampaignDates(startDate: Date, endDate: Date): Promise<void> {
    if (endDate <= startDate) {
      throw new BadRequestException('Ngày kết thúc phải sau ngày bắt đầu');
    }

    const now = new Date();
    if (startDate < now) {
      throw new BadRequestException('Ngày bắt đầu không thể trong quá khứ');
    }
  }
} 