import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Review } from './entity/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async create(dto: CreateReviewDto): Promise<Review> {
    const review = this.reviewRepository.create({
      rating: dto.rating,
      comment: dto.comment,
      product: { id: dto.product_id },
      user: { id: dto.user_id },
    });

    return this.reviewRepository.save(review);
  }

  async findAll(): Promise<Review[]> {
    return this.reviewRepository.find({
      relations: ['product', 'user'],
    });
  }

  async findOne(id: number): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['product', 'user'],
    });

    if (!review) {
      throw new NotFoundException(`Review with id ${id} not found`);
    }

    return review;
  }

  async update(id: number, dto: UpdateReviewDto): Promise<Review> {
    const review = await this.findOne(id);

    if (dto.rating !== undefined) {
      review.rating = dto.rating;
    }

    if (dto.comment !== undefined) {
      review.comment = dto.comment;
    }

    if (dto.product_id !== undefined) {
      review.product = { id: dto.product_id } as Review['product'];
    }

    if (dto.user_id !== undefined) {
      review.user = { id: dto.user_id } as Review['user'];
    }

    return this.reviewRepository.save(review);
  }

  async remove(id: number): Promise<{ message: string }> {
    const review = await this.findOne(id);

    await this.reviewRepository.remove(review);

    return { message: 'Review deleted successfully' };
  }
}
