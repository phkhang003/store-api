import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { Event, EventDocument } from './schemas/event.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { ProductsService } from '../products/products.service';
import { SearchEventDto } from './dto/search-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    private readonly productsService: ProductsService
  ) {}

  async create(createEventDto: CreateEventDto): Promise<EventDocument> {
    // Kiểm tra ngày
    if (createEventDto.endDate <= createEventDto.startDate) {
      throw new BadRequestException('Ngày kết thúc phải sau ngày bắt đầu');
    }

    // Kiểm tra sản phẩm tồn tại
    for (const product of createEventDto.products) {
      const existingProduct = await this.productsService.findOne(product.productId);
      if (!existingProduct) {
        throw new NotFoundException(`Sản phẩm ${product.productId} không tồn tại`);
      }

      if (product.variantId) {
        const variant = existingProduct.variants?.find(
          v => v.variantId.toString() === product.variantId
        );
        if (!variant) {
          throw new NotFoundException(`Biến thể ${product.variantId} không tồn tại`);
        }
      }
    }

    const event = new this.eventModel({
      ...createEventDto,
      products: createEventDto.products.map(p => ({
        ...p,
        productId: new MongooseSchema.Types.ObjectId(p.productId),
        variantId: p.variantId ? new MongooseSchema.Types.ObjectId(p.variantId) : undefined
      }))
    });

    return event.save();
  }

  async findAll(): Promise<EventDocument[]> {
    return this.eventModel
      .find()
      .populate('products.productId', 'name images price')
      .sort({ startDate: -1 })
      .exec();
  }

  async findActive(): Promise<EventDocument[]> {
    const now = new Date();
    return this.eventModel
      .find({
        startDate: { $lte: now },
        endDate: { $gte: now }
      })
      .populate('products.productId', 'name images price')
      .exec();
  }

  async findOne(id: string): Promise<EventDocument> {
    const event = await this.eventModel
      .findById(id)
      .populate('products.productId', 'name images price')
      .exec();

    if (!event) {
      throw new NotFoundException('Sự kiện không tồn tại');
    }
    return event;
  }

  async update(id: string, updateEventDto: CreateEventDto): Promise<EventDocument> {
    const event = await this.findOne(id);

    if (updateEventDto.endDate <= updateEventDto.startDate) {
      throw new BadRequestException('Ngày kết thúc phải sau ngày bắt đầu');
    }

    Object.assign(event, {
      ...updateEventDto,
      products: updateEventDto.products.map(p => ({
        ...p,
        productId: new MongooseSchema.Types.ObjectId(p.productId),
        variantId: p.variantId ? new MongooseSchema.Types.ObjectId(p.variantId) : undefined
      }))
    });

    return event.save();
  }

  async remove(id: string): Promise<void> {
    const result = await this.eventModel.deleteOne({ _id: new MongooseSchema.Types.ObjectId(id) });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Sự kiện không tồn tại');
    }
  }

  async search(searchEventDto: SearchEventDto): Promise<EventDocument[]> {
    const query: any = {};

    if (searchEventDto.keyword) {
      query.$text = { $search: searchEventDto.keyword };
    }

    if (searchEventDto.startDate || searchEventDto.endDate) {
      query.startDate = {};
      if (searchEventDto.startDate) {
        query.startDate.$gte = searchEventDto.startDate;
      }
      if (searchEventDto.endDate) {
        query.endDate = { $lte: searchEventDto.endDate };
      }
    }

    return this.eventModel
      .find(query)
      .populate('products.productId', 'name images price')
      .sort({ startDate: -1 })
      .exec();
  }

  async findByProduct(productId: string): Promise<EventDocument[]> {
    const now = new Date();
    return this.eventModel
      .find({
        'products.productId': new MongooseSchema.Types.ObjectId(productId),
        startDate: { $lte: now },
        endDate: { $gte: now }
      })
      .populate('products.productId', 'name images price')
      .exec();
  }

  async validateEventDates(startDate: Date, endDate: Date): Promise<void> {
    if (endDate <= startDate) {
      throw new BadRequestException('Ngày kết thúc phải sau ngày bắt đầu');
    }

    const now = new Date();
    if (startDate < now) {
      throw new BadRequestException('Ngày bắt đầu không thể trong quá khứ');
    }
  }
} 