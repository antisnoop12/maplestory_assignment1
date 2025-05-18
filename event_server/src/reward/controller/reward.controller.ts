import { Controller, Post, Get, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { RewardService } from '../service/reward.service';
import { Reward } from '../schema/reward.schema';

@Controller('maple/event/reward')
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @Post()
  async createRewardRequest(@Body() body: Partial<Reward>) {
    return this.rewardService.createRewardRequest(body);
  }

  @Get()
  async findAllRewardRequest() {
    return this.rewardService.findAllRewardRequest();
  }

  @Get('nickname')
  async findAll(@Query('nickname') nickname: string | string[]) {
    console.log(nickname);
    if (!nickname) return [];
    const filter = Array.isArray(nickname) ? { nickname: { $in: nickname } } : { nickname };
    return this.rewardService.findAll(filter);
  }

  @Get(':id')
  async findByIdcreateRewardRequest(@Param('id') id: string) {
    return this.rewardService.findRewardRequestById(id);
  }

  @Patch(':id')
  async updateRewardRequestById(@Param('id') id: string, @Body() updateData: Partial<Reward>) {
    return this.rewardService.updateRewardRequestById(id, updateData);
  }

  @Delete(':id')
  async deleteRewardRequestById(@Param('id') id: string) {
    return this.rewardService.deleteRewardRequestById(id);
  }
}
