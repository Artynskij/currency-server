import { Injectable } from '@nestjs/common';
import { CreateBankDto, errorCreate } from './dto/create-bank.dto';
import { UpdateBankDto, errorUpdate } from './dto/update-bank.dto';

import { InjectModel } from '@nestjs/sequelize';
import { Bank } from './entities/bank.entity';
import { mockBanks } from 'src/asset/utils/isoBanks';

@Injectable()
export class BankService {
  constructor(
    @InjectModel(Bank)
    private bankModel: typeof Bank,
  ) {}
  async createMockBank() {
    let message;
    const addedBanks = [];
    const checkBanks = mockBanks.map(async (item) => {
      const haveInDB = await this.bankModel.findOne({
        where: { codename: item.codename },
      });

      if (!haveInDB) {
        await this.bankModel.create(item);
        addedBanks.push(item);
      }
    });
    await Promise.all(checkBanks);
    if (addedBanks.length === 0) {
      message = `We are added ${addedBanks.length}`;
    } else {
      message = 'all mock banks imports';
    }

    return {
      message: message,
      addedBanks: addedBanks,
    };
  }
  create(createBankDto: CreateBankDto): Promise<Bank> | errorCreate {
    function errorFunc() {
      const errorMessage = {
        message: '',
        obj: createBankDto,
        error: 'Не хватает :',
      };
      if (!createBankDto.codename) {
        errorMessage.error += ' codename';
      }
      if (!createBankDto.idbank) {
        errorMessage.error += ' idbank';
      }
      if (!createBankDto.logo) {
        errorMessage.error += ' logo';
      }
      if (!createBankDto.name) {
        errorMessage.error += ' name';
      }
      return errorMessage;
    }
    if (
      !createBankDto.codename ||
      !createBankDto.idbank ||
      !createBankDto.logo ||
      !createBankDto.name
    ) {
      return errorFunc();
    }

    const bank = new Bank();

    bank.name = createBankDto.name;
    bank.logo = createBankDto.logo;
    bank.idbank = createBankDto.idbank;
    bank.codename = createBankDto.codename;

    return bank.save();
  }

  findAll(): Promise<Bank[]> {
    return this.bankModel.findAll();
  }

  findOne(idbank: number): Promise<Bank> {
    const bank = this.bankModel.findOne({ where: { idbank } });
    return bank;
  }
  async findByName(codename: string): Promise<Bank> {
    const bank = await this.bankModel.findOne({ where: { codename } });

    return bank;
  }

  async update(
    idbank: number,
    updateBankDto: UpdateBankDto,
  ): Promise<{ oldData: Bank; newData: Bank } | errorUpdate> {
    const oldBank = await this.bankModel.findOne({ where: { idbank } });
    if (!oldBank) {
      const errorMessage = {
        message: 'Такого idbank не существует',
        obj: oldBank,
        error: `idbank = ${idbank}`,
      };
      return errorMessage;
    }
    const newDataBank = {
      codename: updateBankDto.codename || oldBank.codename,
      idbank: updateBankDto.idbank || oldBank.idbank,
      logo: updateBankDto.logo || oldBank.logo,
      name: updateBankDto.name || oldBank.name,
    };
    await this.bankModel.update(newDataBank, { where: { idbank } });
    const updatedBank = await this.bankModel.findOne({
      where: { idbank: updateBankDto.idbank },
    });

    return {
      oldData: oldBank,
      newData: updatedBank,
    };
  }

  async remove(idbank: number) {
    const bank = await this.bankModel.findOne({ where: { idbank } });
    if (!bank) {
      return 'такого банка не существует';
    }
    await bank.destroy();
    return {
      bank: bank,
      message: 'банк успешно удален',
    };
  }
}
