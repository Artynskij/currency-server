import { BankService } from './../bank/bank.service';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cron } from '@nestjs/schedule';

import { CreateRankDto, errorCreate } from './dto/create-rank.dto';
import { UpdateRankDto, errorUpdate } from './dto/update-rank.dto';

import { Rank } from './entities/rank.entity';

import { IRateInBd, IResponseAxios } from 'src/asset/types/commonTypes';

import { parsingMyfin } from 'src/asset/getRank/parsing/parsingMyfin';
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
    const response = await this.callingUpdateRates();
    const date = new Date();
    console.log(`auto update : ${date}`);
  }
  // get byn
  async findByn() {
    const ranksMain = await this.rankModel.findAll({
      where: { buyiso: 'BYN' },
    });
    const banks = await this.bankService.findAll();
    const dateNow = new Date();
    // формирование [bank, bank, ...bank] моковые
    banks.sort((a, b) => a.idbank - b.idbank);
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
        filials: { rows: 0, data: [] },
      };
      return banksRanks;
    });
    // подставляем актуальные данные курсов для возврата на клиент главн
    ranksMain.map((item) => {
      const newBankData = mutationData.find(
        (itemBank) => itemBank.bank.codename === item.codename,
      );
      if (item.type === 'main') {
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
      }
      // если тип филиал подставляем данные филиала
      if (item.type === 'filial') {
        const actualFilial = newBankData.filials.data.find(
          (filial) => filial.address === item.address,
        );
        // если существует филиал то дополняем
        if (actualFilial) {
          switch (item.seliso) {
            case 'EUR':
              actualFilial.currency.eur.selrate = item.selrate;
              actualFilial.currency.eur.buyrate = item.buyrate;
              actualFilial.currency.eur.dateUpdate = item.updatedAt;
              break;
            case 'USD':
              actualFilial.currency.usd.selrate = item.selrate;
              actualFilial.currency.usd.buyrate = item.buyrate;
              actualFilial.currency.usd.dateUpdate = item.updatedAt;
              break;
            case 'RUB':
              actualFilial.currency.rub.selrate = item.selrate;
              actualFilial.currency.rub.buyrate = item.buyrate;
              actualFilial.currency.rub.dateUpdate = item.updatedAt;
              break;

            default:
              break;
          }
        } else {
          // если не существует филиал то создаем
          const newFilial = {
            address: item.address,
            currency: {
              usd: { selrate: '', buyrate: '', dateUpdate: '' },
              eur: { selrate: '', buyrate: '', dateUpdate: '' },
              rub: { selrate: '', buyrate: '', dateUpdate: '' },
            },
            coord: item.coord,
          };
          switch (item.seliso) {
            case 'EUR':
              newFilial.currency.eur.selrate = item.selrate;
              newFilial.currency.eur.buyrate = item.buyrate;
              newFilial.currency.eur.dateUpdate = item.updatedAt;
              break;
            case 'USD':
              newFilial.currency.usd.selrate = item.selrate;
              newFilial.currency.usd.buyrate = item.buyrate;
              newFilial.currency.usd.dateUpdate = item.updatedAt;
              break;
            case 'RUB':
              newFilial.currency.rub.selrate = item.selrate;
              newFilial.currency.rub.buyrate = item.buyrate;
              newFilial.currency.rub.dateUpdate = item.updatedAt;
              break;

            default:
              break;
          }
          newBankData.filials.data.push(newFilial);
        }
      }

      return 'pushItem';
    });
    // фильтрация. если обновление было не сегодня то убираем обьект
    const filteredMutationData = mutationData.filter((bank) => {
      const dateUpdated = new Date(bank.currency.usd.dateUpdate);

      const actualDate =
        dateNow.getDate() === dateUpdated.getDate() &&
        dateNow.getFullYear() === dateUpdated.getFullYear() &&
        dateNow.getMonth() === dateUpdated.getMonth();

      return bank.currency.eur.buyrate && actualDate;
    });
    const filteredMutationDataFilials = filteredMutationData.map((bank) => {
      const newDataOfBank = bank;
      const filteredFilials = bank.filials.data.filter((filial) => {
        const dateUpdated = new Date(filial.currency.usd.dateUpdate);

        const actualDate =
          dateNow.getDate() === dateUpdated.getDate() &&
          dateNow.getFullYear() === dateUpdated.getFullYear() &&
          dateNow.getMonth() === dateUpdated.getMonth();
        return filial.currency.eur.buyrate && actualDate;
      });

      newDataOfBank.filials.rows = filteredFilials.length;
      newDataOfBank.filials.data = filteredFilials;
      return newDataOfBank;
    });
    const promiseData = await Promise.all(filteredMutationDataFilials);
    return {
      rows: promiseData.length,
      data: promiseData,
    };
  }
  async findOne(codename: string): Promise<Rank[]> {
    const rank = await this.rankModel.findAll({ where: { codename } });
    return rank;
  }
  // not used
  async findAll() {
    const ranks = await this.rankModel.findAll();
    return ranks;
  }

  async create(createRankDto: CreateRankDto): Promise<Rank | errorCreate> {
    function errorCreate(mess: string, example?: Rank) {
      const errorMessage: errorCreate = {
        message: 'Что-то пошло не так.',
        obj: createRankDto,
        error: mess,
        forExample: example,
      };
      if (!createRankDto.buyrate) {
        errorMessage.error += ' buyrate';
      }
      if (!createRankDto.selrate) {
        errorMessage.error += ' selrate';
      }
      if (!createRankDto.codename) {
        errorMessage.error += ' codename';
      }
      if (!createRankDto.seliso) {
        errorMessage.error += ' seliso';
      }
      if (!createRankDto.name) {
        errorMessage.error += ' name';
      }
      return errorMessage;
    }
    function checkData(data: CreateRankDto) {
      const newData: CreateRankDto = {
        address: data.address || 'custom',
        buyiso: data.buyiso || 'BYN',
        buyrate: data.buyrate,
        codename: data.codename,
        coord: data.coord || 'custom',
        name: data.name,
        quantity: data.quantity || 1,
        seliso: data.seliso,
        selrate: data.selrate,
        type: data.type || 'custom',
      };
      return newData;
    }
    if (
      !createRankDto.buyrate ||
      !createRankDto.selrate ||
      !createRankDto.codename ||
      !createRankDto.seliso ||
      !createRankDto.name
    ) {
      const example = await this.rankModel.findOne({
        where: { buyiso: 'BYN' },
      });
      return errorCreate('Не хватает :', example);
    }
    const trueBank = await this.bankService.findByName(createRankDto.codename);
    if (!trueBank) {
      return errorCreate(
        `${createRankDto.codename}. Нету такого банка в базе данных.`,
      );
    }
    const rank = await this.rankModel.create({ ...checkData(createRankDto) });
    return rank.save();
  }

  async update(
    id: string,
    updateRankDto: UpdateRankDto,
  ): Promise<{ oldData: Rank; newData: Rank } | errorUpdate> {
    function errorUpdate(example: Rank) {
      const errorMessage: errorUpdate = {
        message: 'Что-то пошло не так.',
        obj: updateRankDto,
        error: 'Не хватает :',
        forExample: example,
      };
      if (!updateRankDto.buyrate) {
        errorMessage.error += ' buyrate';
      }
      if (!updateRankDto.selrate) {
        errorMessage.error += ' selrate';
      }
      if (!updateRankDto.codename) {
        errorMessage.error += ' codename';
      }
      if (!updateRankDto.seliso) {
        errorMessage.error += ' seliso';
      }
      if (!updateRankDto.name) {
        errorMessage.error += ' name';
      }
      return errorMessage;
    }
    if (
      !updateRankDto.buyrate &&
      !updateRankDto.selrate &&
      !updateRankDto.codename &&
      !updateRankDto.seliso &&
      !updateRankDto.name
    ) {
      const example = await this.rankModel.findOne({
        where: { buyiso: 'BYN' },
      });
      return errorUpdate(example);
    }
    await this.rankModel.update(updateRankDto, {
      where: {
        codename: updateRankDto.codename,
        seliso: updateRankDto.seliso,
        address: updateRankDto.address || 'custom',
      },
    });

    const oldRank = await this.rankModel.findOne({ where: { id } });
    await this.rankModel.update(updateRankDto, { where: { id } });
    const updatedRank = await this.rankModel.findOne({
      where: {
        codename: updateRankDto.codename,
        seliso: updateRankDto.seliso,
        address: updateRankDto.address || 'custom',
      },
    });
    return {
      oldData: oldRank,
      newData: updatedRank,
    };
  }
  // not used
  async remove(id: number) {
    const rank = await this.rankModel.findOne({ where: { id } });
    if (!rank) {
      return 'такого курса не существует';
    }
    await rank.destroy();
    return {
      rank: rank,
      message: 'банк успешно удален',
    };
  }

  async callingUpdateRates() {
    const returnRequestParsingMyfin = await this.updateRatesParsing(
      parsingMyfin,
      'parsing',
    );

    if (!returnRequestParsingMyfin.error) {
      // console.log(returnRequestParsingMyfin);
      return returnRequestParsingMyfin;
    }
    const requestApi = await Promise.all(
      getRankBank().map(async (bank) => {
        const res = await this.updateRates(bank.func, bank.name);
        return res;
      }),
    );

    // console.log(returnRequestParsingMyfin.error);
    // console.log(requestApi);
    return requestApi;
  }
  // отдельный функции для красоты
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
              address: rate.address,
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
