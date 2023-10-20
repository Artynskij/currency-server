import { Module } from '@nestjs/common';
import { RankService } from './rank.service';
import { RankController } from './rank.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Rank } from './entities/rank.entity';
import { BankModule } from 'src/bank/bank.module';

@Module({
  imports: [SequelizeModule.forFeature([Rank]), BankModule],
  controllers: [RankController],
  providers: [RankService],
  exports: [RankService],
})
export class RankModule {}
