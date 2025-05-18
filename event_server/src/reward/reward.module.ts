import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Reward, RewardSchema } from './schema/reward.schema';
import { RewardService } from './service/reward.service';
import { RewardController } from './controller/reward.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Reward.name, schema: RewardSchema }])],
  providers: [RewardService],
  controllers: [RewardController],
})
export class RewardModule {}
