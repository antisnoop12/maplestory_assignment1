import { Controller, Post, Body, Get, Param, Patch, Delete, Req, Query } from '@nestjs/common';
import { EventService } from '../service/event.service';
import { Event } from '../schema/event.schema';

@Controller('maple/event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post('admin/add')
  async createEvent(@Body() body: Partial<Event>) {
    return this.eventService.createEvent(body);
  }

  @Get('admin')
  async findAllEvent() {
    return this.eventService.findEventAll();
  }

  @Get('admin/:id')
  async findEventById(@Param('id') id: string) {
    return this.eventService.findEventById(id);
  }

  // 이벤트 id로 수정
  @Patch('admin/:id')
  async updateEventById(@Param('id') id: string, @Body() updateData: Partial<Event>) {
    const updated = await this.eventService.updateEventById(id, updateData);
    if (!updated) {
      return { message: 'Event not found' };
    }
    return updated;
  }

  // 이벤트 id로 삭제
  @Delete('admin/:id')
  async deleteEventById(@Param('id') id: string) {
    return this.eventService.deleteEventById(id);
  }

  // 이벤트에 보상 추가
  @Post('admin/addReward/:id')
  async addRewardToEvent(
    @Param('id') id: string,
    @Body() body: { rewardNm: string; rewardCount: number },
  ) {
    const { rewardNm, rewardCount } = body;
    const updatedEvent = await this.eventService.addRewardToEventById(id, rewardNm, rewardCount);
    if (!updatedEvent) {
      return { message: 'Event not found' };
    }
    return updatedEvent;
  }

  // 이벤트 보상 리스트 조회
  @Get('admin/rewards/:id')
  async getEventRewards(@Param('id') id: string) {
    const rewards = await this.eventService.getEventRewardsById(id);
    if (!rewards) {
      return { message: 'Event not found' };
    }
    return rewards;
  }

  // 이벤트 보상 요구 확인
  // @Post('admin/achievements')
  // async getAchievementsByTitleAndSubTitle(@Body() body: { title: string; subTitle: string }) {
  //   const { title, subTitle } = body;
  //   const achievements = await this.eventService.getAchievementsByTitleAndSubTitle(title, subTitle);
  //   if (!achievements) {
  //     return { message: 'Event not found' };
  //   }
  //   return achievements;
  // }
}
