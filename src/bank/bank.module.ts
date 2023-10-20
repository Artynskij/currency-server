import { Module } from '@nestjs/common';
import { BankService } from './bank.service';
import { BankController } from './bank.controller';

import { SequelizeModule } from '@nestjs/sequelize';
import { Bank } from './entities/bank.entity';

@Module({
  imports: [SequelizeModule.forFeature([Bank])],
  controllers: [BankController],
  providers: [BankService],
  exports: [BankService],
})
export class BankModule {}
