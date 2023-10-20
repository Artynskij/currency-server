import { Injectable } from '@nestjs/common';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';

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
        addedBanks.push(haveInDB);
        await this.bankModel.create(item);
      }
    });
    await Promise.all(checkBanks);
    if (addedBanks.length === 0) {
      message = `Something happens. Our bd have some bank. We are added ${addedBanks.length}`;
    } else {
      message = 'all mock banks imports';
    }

    return {
      message: message,
      addedBanks: addedBanks,
    };
  }
  create(createBankDto: CreateBankDto): Promise<Bank> {
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

  async update(idbank: number, updateBankDto: UpdateBankDto) {
    const oldBank = await this.bankModel.findOne({ where: { idbank } });

    const newDataBank = {
      codename: oldBank.codename,
      idbank: oldBank.idbank,
      logo: updateBankDto.logo,
      name: updateBankDto.name,
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
    await bank.destroy();
  }
}
