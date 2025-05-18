import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EventDocument = Event & Document;

@Schema()
export class Event {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  subTitle: string;

  @Prop({ required: true })
  option: string;

  @Prop({ required: true })
  destination: string;

  @Prop({ required: true, default: 0 })
  eventLevel: number;

  @Prop({
    type: [
      {
        rewardNm: { type: String, required: true },
        rewardCount: { type: Number, default: false },
      },
    ],
    default: [],
  })
  reward: { rewardNm: string; rewardCount: number }[];

  @Prop()
  description: string;

  //   @Prop({
  //     type: [
  //       {
  //         userId: { type: String, required: true },
  //         userCharId: { type: String, required: true },
  //         rewardedList: [
  //           {
  //             rewardNm: { type: String, required: true },
  //             count: { type: Number, required: true },
  //           },
  //         ],
  //         allRewarded: { type: Boolean, default: false },
  //       },
  //     ],
  //     default: [],
  //   })
  //   achievements: {
  //     userId: string;
  //     userCharId: string;
  //     rewardedList: { rewardNm: string; count: number }[];
  //     allRewarded: boolean;
  //   }[];

  @Prop({ required: true })
  deadline: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);
