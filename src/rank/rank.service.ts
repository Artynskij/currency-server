import { BankService } from './../bank/bank.service';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cron } from '@nestjs/schedule';

import { CreateRankDto } from './dto/create-rank.dto';
import { UpdateRankDto } from './dto/update-rank.dto';

import { Rank } from './entities/rank.entity';

import { IRateInBd, IResponseAxios } from 'src/asset/types/commonTypes';

import { parcingMyfin } from 'src/asset/getRank/parcing/parcingMyfin';
import { getRankBank } from 'src/asset/getRank';

@Injectable()
export class RankService {
  constructor(
    @InjectModel(Rank)
    private rankModel: typeof Rank,
    private readonly bankService: BankService,
  ) {}
  @Cron('0 0,10,20,30,40,50 * * * *')
  async handleCron() {
    const responce = await this.callingUpdateRates();
    const date = new Date();
    console.log(`auto update : ${date}`);
  }
  async create(createRankDto: CreateRankDto): Promise<Rank> {
    if (!createRankDto.buyrate && !createRankDto.selrate) {
      return;
    }
    const rank = await this.rankModel.create({ ...createRankDto });
    return rank.save();
  }

  async findAll() {
    const ranks = await this.rankModel.findAll();

    return ranks;
  }
  async findByn() {
    const ranks = await this.rankModel.findAll({ where: { buyiso: 'BYN' } });
    const banks = await this.bankService.findAll();
    const mutationData = banks.map((item) => {
      const banksRanks = {
        id: item.id,
        codename: item.codename,
        bank: item,
        currency: {
          usd: { selrate: '', buyrate: '', dateUpdate: '' },
          eur: { selrate: '', buyrate: '', dateUpdate: '' },
          rub: { selrate: '', buyrate: '', dateUpdate: '' },
        },
      };
      return banksRanks;
    });

    ranks.map((item) => {
      const newBankData = mutationData.find(
        (itemBank) => itemBank.bank.codename === item.codename,
      );

      if (item.seliso === 'EUR') {
        newBankData.currency.eur.selrate = item.selrate;
        newBankData.currency.eur.buyrate = item.buyrate;
        newBankData.currency.eur.dateUpdate = item.updatedAt;
      } else if (item.seliso === 'USD') {
        newBankData.currency.usd.selrate = item.selrate;
        newBankData.currency.usd.buyrate = item.buyrate;
        newBankData.currency.usd.dateUpdate = item.updatedAt;
      } else if (item.seliso === 'RUB') {
        newBankData.currency.rub.selrate = item.selrate;
        newBankData.currency.rub.buyrate = item.buyrate;
        newBankData.currency.rub.dateUpdate = item.updatedAt;
      }
      return 'pushItem';
    });

    const filteredMutationData = mutationData.filter((item) => {
      const dateUpdated = new Date(item.currency.usd.dateUpdate);
      const dateNow = new Date();
      const actualDate =
        dateNow.getDay() === dateUpdated.getDay() &&
        dateNow.getFullYear() === dateUpdated.getFullYear() &&
        dateNow.getMonth() === dateUpdated.getMonth();

      return item.currency.eur.buyrate && actualDate;
    });
    const promiseData = await Promise.all(filteredMutationData);
    return {
      rows: promiseData.length,
      data: promiseData,
    };
  }

  async findOne(id: number): Promise<Rank> {
    const rank = await this.rankModel.findOne({ where: { id } });
    return rank;
  }

  async update(id: string, updateRankDto: UpdateRankDto) {
    const oldRank = await this.rankModel.findOne({ where: { id } });
    await this.rankModel.update(updateRankDto, { where: { id } });
    const updatedRank = await this.rankModel.findOne({
      where: { id },
    });
    return {
      oldData: oldRank,
      newData: updatedRank,
    };
  }

  remove(id: number) {
    return `This action removes a #${id} rank`;
  }

  async callingUpdateRates() {
    const returnRequestParsingMyfin = await this.updateRatesParsing(
      parcingMyfin,
      'parcing',
    );

    if (!returnRequestParsingMyfin.error) {
      console.log(returnRequestParsingMyfin);
      return returnRequestParsingMyfin;
    }

    const requestApi = await Promise.all(
      getRankBank().map(async (bank) => {
        const res = await this.updateRates(bank.func, bank.name);
        return res;
      }),
    );

    console.log(returnRequestParsingMyfin.error);
    console.log(requestApi);
    return requestApi;
  }

  async updateRates(getFunc, codeName: string) {
    const getRateBank = await getFunc(codeName).then((res: IResponseAxios) => {
      if (res.data) {
        res.data.map(async (rate: IRateInBd) => {
          const rateInBd = await this.rankModel.findOne({
            where: {
              buyiso: rate.buyiso,
              seliso: rate.seliso,
              codename: rate.codename,
            },
          });
          if (!rateInBd) {
            await this.create(rate);
          } else {
            await this.update(rateInBd.id, rate);
          }
        });
        res.message.title = `${codeName} all ok and all updated`;
        return res.message.title;
      } else {
        return res.message;
      }
    });
    return getRateBank;
  }
  async updateRatesParsing(getFunc, codeName: string) {
    const getRateBank = await getFunc().then((res: IResponseAxios) => {
      if (res.data) {
        res.data.map(async (rate: IRateInBd) => {
          const rateInBd = await this.rankModel.findOne({
            where: {
              buyiso: rate.buyiso,
              seliso: rate.seliso,
              codename: rate.codename,
            },
          });
          if (!rateInBd) {
            await this.create(rate);
          } else {
            await this.update(rateInBd.id, rate);
          }
        });
        res.message.title = `${res.message.title}.`;
        // console.log(res);

        return res.message.title;
      } else {
        return res.message;
      }
    });
    return getRateBank;
  }
}
