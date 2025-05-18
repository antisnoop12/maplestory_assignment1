import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Character, CharacterSchema } from './schema/character.schema';
import { CharacterService } from './service/character.service';
import { CharacterController } from './controller/character.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Character.name, schema: CharacterSchema }])],
  providers: [CharacterService],
  controllers: [CharacterController],
  exports: [CharacterService], // 필요시 외부 모듈에서 사용 가능
})
export class CharacterModule {}
