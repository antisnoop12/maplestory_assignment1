import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RewardDocument = Reward & Document;

@Schema()
export class Reward {
  @Prop({ required: true })
  nickname: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  subTitle: string;

  @Prop({ required: true, default: false })
  rewarded: boolean;

  @Prop({ required: true })
  requestAt: Date;

  @Prop()
  rewardedAt?: Date;

  @Prop({ required: true })
  conditionName: string;

  @Prop({ required: true })
  conditionValue: number;
}

export const RewardSchema = SchemaFactory.createForClass(Reward);
