import { BankService } from './../bank/bank.service';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cron } from '@nestjs/schedule';

import { CreateRankDto } from './dto/create-rank.dto';
import { UpdateRankDto } from './dto/update-rank.dto';

import { Rank } from './entities/rank.entity';
import { Bank } from 'src/bank/entities/bank.entity';

import { getAlfaRank } from 'src/asset/getRank/apiBank/Alfa/alfaRank';
import { CONSTANS__NAMES_BANKS } from 'src/asset/utils/isoBanks';
import { IRateInBd, IResponseAxios } from 'src/asset/types/commonTypes';
import { getBelarusbankRank } from 'src/asset/getRank/apiBank/Belarusbank/belarusbankRank';
import { getDabrabytRank } from 'src/asset/getRank/apiBank/Dabrabyt/dabrabytRank';
import { getRRBRank } from 'src/asset/getRank/apiBank/RRB/RRBRank';
import { IRankResponceByn } from './types/rankResponce.type';
import { getBelagroRank } from 'src/asset/getRank/apiBank/Belagro/belagroRank';
import { getReshenieRank } from 'src/asset/getRank/apiBank/Reshenie/reshenieRank';
import { getVTBRank } from 'src/asset/getRank/apiBank/VTB/VTBRank';
import { getMTBRank } from 'src/asset/getRank/apiBank/MTB/MTBRank';
import { getPriorRank } from 'src/asset/getRank/apiBank/Prior/PriorRank';
import { getBSBRank } from 'src/asset/getRank/apiBank/BSB/BSBRank';
import { parcingMyfin } from 'src/asset/getRank/parcing/parcingMyfin';

@Injectable()
export class RankService {
  constructor(
    @InjectModel(Rank)
    private rankModel: typeof Rank,
    private readonly bankService: BankService,
  ) {}
  @Cron('45 35 * * * *')
  async handleCron() {
    const responce = await this.callingUpdateRates();
    console.log('auto update');
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
      const banksTest = {
        id: item.id,
        codename: item.codename,
        bank: item,
        currency: {
          usd: { selrate: '', buyrate: '', dateUpdate: '' },
          eur: { selrate: '', buyrate: '', dateUpdate: '' },
          rub: { selrate: '', buyrate: '', dateUpdate: '' },
        },
      };
      return banksTest;
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
      // banksTest.push(newBankData);
      return 'pushItem';
    });
    const filteredMutationData = mutationData.filter(
      (item) => item.currency.eur.buyrate,
    );
    return Promise.all(filteredMutationData);
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
    // const parcingData = await parcingMyfin();
    // return await parcingMyfin();
    const returnerArray = [
      await this.updateRates(getAlfaRank, CONSTANS__NAMES_BANKS.ALFA),
      await this.updateRates(
        getBelarusbankRank,
        CONSTANS__NAMES_BANKS.BELARUSBANK,
      ),
      await this.updateRates(getDabrabytRank, CONSTANS__NAMES_BANKS.DABRABYT),
      await this.updateRates(getRRBRank, CONSTANS__NAMES_BANKS.RRB),
      await this.updateRates(getBelagroRank, CONSTANS__NAMES_BANKS.BELAGRO),
      await this.updateRates(getReshenieRank, CONSTANS__NAMES_BANKS.RESHENIE),
      await this.updateRates(getVTBRank, CONSTANS__NAMES_BANKS.VTB),
      await this.updateRates(getMTBRank, CONSTANS__NAMES_BANKS.MTB),
      await this.updateRates(getPriorRank, CONSTANS__NAMES_BANKS.PRIOR),
      await this.updateRates(getBSBRank, CONSTANS__NAMES_BANKS.BSB),
      await this.updateRatesParcing(parcingMyfin, 'parcing'),
      // await getBelagroRank(CONSTANS__NAMES_BANKS.BELAGRO),
      // await parcingMyfin(),
    ];
    console.log(returnerArray);

    return returnerArray;
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
  async updateRatesParcing(getFunc, codeName: string) {
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
        res.message.title = `${res.message.title}. And all updated`;
        return res.message.title;
      } else {
        return res.message;
      }
    });
    return getRateBank;
  }
}
