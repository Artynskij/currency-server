import { SequelizeModule } from '@nestjs/sequelize';
import { ScheduleModule } from '@nestjs/schedule';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeConfigService } from './config/sequelizeConfig.service';
import { databaseConfig } from './config/configuration';
import { CurrencyModule } from './currency/currency.module';
import { BankModule } from './bank/bank.module';
import { RankModule } from './rank/rank.module';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule, ScheduleModule.forRoot()],
      useClass: SequelizeConfigService,
    }),
    ConfigModule.forRoot({
      load: [databaseConfig],
    }),
    CurrencyModule,
    BankModule,
    RankModule,
  ],
})
export class AppModule {}
