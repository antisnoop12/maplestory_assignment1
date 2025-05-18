import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CharacterDocument = Character & Document;

@Schema()
export class Character {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, unique: true })
  nickname: string;

  @Prop({ required: true, default: 1 })
  level: number;

  @Prop({ required: true, default: 0 })
  arcaneForce: number;
}

export const CharacterSchema = SchemaFactory.createForClass(Character);
