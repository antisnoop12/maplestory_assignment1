import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  HttpException,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { CharacterService } from '../service/character.service';
import { Character } from '../schema/character.schema';

@Controller('maple/auth/characters')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Post()
  async createCharacter(@Body() body: { userId: string; nickname: string }) {
    try {
      return await this.characterService.createCharacter(body);
    } catch (error) {
      if (error.code === 11000) {
        throw new HttpException('이미 존재하는 닉네임입니다.', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAllCharacter() {
    return this.characterService.findAllCharacter();
  }

  @Get('nickname/:nickname')
  async findCharacterByNickname(@Param('nickname') nickname: string) {
    return this.characterService.findCharacterByNickname(nickname);
  }

  @Put(':id')
  async updateCharacter(@Param('id') id: string, @Body() body: Partial<Character>) {
    return this.characterService.updateCharacter(id, body);
  }

  @Delete(':id')
  async deleteCharacter(@Param('id') id: string) {
    return this.characterService.deleteCharacter(id);
  }

  @Get('userId/:userId')
  async findByUserId(@Param('userId') userId: string) {
    return this.characterService.findCharacterByUserId(userId);
  }

  @Get('user/:userId/nickname/:nickname')
  async findByUserIdAndNickname(
    @Param('userId') userId: string,
    @Param('nickname') nickname: string,
  ) {
    return this.characterService.findByUserIdAndNickname(userId, nickname);
  }

  @Patch('nickname/:nickname')
  async updateByNickname(
    @Param('nickname') nickname: string,
    @Body() body: { level?: number; arcaneForce?: number },
  ) {
    return this.characterService.updateByNickname(nickname, body);
  }
}
