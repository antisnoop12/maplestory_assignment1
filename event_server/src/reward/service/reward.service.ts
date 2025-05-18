import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reward, RewardDocument } from '../schema/reward.schema';

@Injectable()
export class RewardService {
  constructor(@InjectModel(Reward.name) private rewardModel: Model<RewardDocument>) {}

  async createRewardRequest(data: Partial<Reward>): Promise<Reward> {
    const exists = await this.rewardModel
      .findOne({
        title: data.title,
        subTitle: data.subTitle,
        nickname: data.nickname,
      })
      .exec();
    if (exists) {
      throw new BadRequestException('보상은 1회만 수령 가능합니다.');
    }
    const created = new this.rewardModel({
      ...data,
      requestAt: new Date(),
    });
    return created.save();
  }

  async findAllRewardRequest(): Promise<Reward[]> {
    return this.rewardModel.find().exec();
  }

  async findRewardRequestById(id: string): Promise<Reward | null> {
    return this.rewardModel.findById(id).exec();
  }

  async updateRewardRequestById(id: string, updateData: Partial<Reward>): Promise<Reward | null> {
    return this.rewardModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async deleteRewardRequestById(id: string): Promise<{ deleted: boolean }> {
    const result = await this.rewardModel.deleteOne({ _id: id }).exec();
    return { deleted: result.deletedCount === 1 };
  }

  async findAll(filter: any = {}): Promise<Reward[]> {
    return this.rewardModel.find(filter).exec();
  }
}
