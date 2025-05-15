import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true }) // timestamps: true로 생성/수정 시간 자동 기록
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  phone: string;

  @Prop({ required: true, min: 0 })
  age: number;

  @Prop({ default: true })
  isActive: boolean;
}

// 스키마 생성
export const UserSchema = SchemaFactory.createForClass(User);
