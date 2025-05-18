import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Character, CharacterDocument } from '../schema/character.schema';

@Injectable()
export class CharacterService {
  constructor(@InjectModel(Character.name) private characterModel: Model<CharacterDocument>) {}

  async createCharacter(data: Partial<Character>): Promise<Character> {
    const exists = await this.characterModel.findOne({ nickname: data.nickname }).exec();
    if (exists) {
      throw new Error('이미 존재하는 닉네임입니다.');
    }
    const created = new this.characterModel(data);
    return created.save();
  }

  async findAllCharacter(): Promise<Character[]> {
    return this.characterModel.find().exec();
  }

  async findCharacterByNickname(nickname: string): Promise<Character | null> {
    return this.characterModel.findOne({ nickname }).exec();
  }

  async updateCharacter(nickname: string, data: Partial<Character>): Promise<Character | null> {
    return this.characterModel.findByIdAndUpdate(nickname, data, { new: true }).exec();
  }

  async deleteCharacter(id: string): Promise<{ deleted: boolean }> {
    const result = await this.characterModel.deleteOne({ _id: id }).exec();
    return { deleted: result.deletedCount === 1 };
  }

  async findCharacterByUserId(userId: string): Promise<Character[]> {
    return this.characterModel.find({ userId }).exec();
  }

  async existsByUserIdAndNickname(userId: string, nickname: string): Promise<boolean> {
    return !!(await this.characterModel.findOne({ userId, nickname }).exec());
  }

  async findByUserIdAndNickname(userId: string, nickname: string): Promise<Character | null> {
    return this.characterModel.findOne({ userId, nickname }).exec();
  }

  async updateByNickname(
    nickname: string,
    updateData: { level?: number; arcaneForce?: number },
  ): Promise<Character | null> {
    return this.characterModel.findOneAndUpdate({ nickname }, updateData, { new: true }).exec();
  }
}
