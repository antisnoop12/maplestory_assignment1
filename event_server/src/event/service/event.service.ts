import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from '../schema/event.schema';

@Injectable()
export class EventService {
  constructor(@InjectModel(Event.name) private eventModel: Model<EventDocument>) {}

  // 이벤트 생성
  async createEvent(data: Partial<Event>): Promise<Event> {
    const created = new this.eventModel(data);
    return created.save();
  }

  // 이벤트 전체 조회
  async findEventAll(): Promise<Event[]> {
    return this.eventModel.find().exec();
  }

  // 이벤트 검색
  async findEventById(id: string): Promise<Event | null> {
    return this.eventModel.findById(id).exec();
  }

  // 이벤트 id로 수정
  async updateEventById(id: string, updateData: Partial<Event>): Promise<Event | null> {
    return this.eventModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  // 이벤트 id로 삭제
  async deleteEventById(id: string): Promise<{ deleted: boolean }> {
    const result = await this.eventModel.deleteOne({ _id: id }).exec();
    return { deleted: result.deletedCount === 1 };
  }

  // 이벤트에 유저 등록
  // async addUserToEventByTitle(
  //   title: string,
  //   subTitle: string,
  //   userId: string,
  //   userCharId: string,
  // ): Promise<Event | null> {
  //   const event = await this.eventModel.findOne({ title, subTitle }).exec();
  //   if (!event) return null;
  //
  //   const idx = event.achievements.findIndex(a => a.userId === userId);
  //
  //   if (idx !== -1) {
  //     // 이미 userId가 있으면 userCharId만 갱신
  //     event.achievements[idx].userCharId = userCharId;
  //   } else {
  //     const rewardedList = (event.reward || []).map(r => ({
  //       rewardNm: r.rewardNm,
  //       count: 0,
  //     }));
  //
  //     event.achievements.push({
  //       userId,
  //       userCharId,
  //       rewardedList: rewardedList,
  //       allRewarded: false,
  //     });
  //   }
  //
  //   await event.save();
  //   return event;
  // }

  // 이벤트에 보상 추가
  async addRewardToEventById(
    eventId: string,
    rewardNm: string,
    rewardCount: number,
  ): Promise<Event | null> {
    const event = await this.eventModel.findById(eventId).exec();
    if (!event) return null;

    const exists = event.reward.some(r => r.rewardNm === rewardNm);
    if (exists) {
      event.reward = event.reward.map(r => (r.rewardNm === rewardNm ? { ...r, rewardCount } : r));
      await event.save();
      return event;
    }

    event.reward.push({ rewardNm, rewardCount });
    await event.save();
    return event;
  }

  // 보상 조회
  async getEventRewardsById(
    eventId: string,
  ): Promise<{ rewardNm: string; rewardCount: number }[] | null> {
    const event = await this.eventModel.findById(eventId).exec();
    if (!event) return null;
    return event.reward;
  }

  // 이벤트의 achievements 조회 (title, subTitle로)
  // async getAchievementsByTitleAndSubTitle(title: string, subTitle: string): Promise<any[] | null> {
  //   const event = await this.eventModel.findOne({ title, subTitle }).exec();
  //   if (!event) return null;
  //   return event.achievements;
  // }
}
