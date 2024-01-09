import axios from 'axios';
import { requestAxiosBank } from '../../axios';

import { IMessageStatus, IRateInBd } from '../../../types/commonTypes';

import { CONSTANS__TYPE_MONEY } from 'src/asset/utils/isoBanks';
import { ISberResponce } from './sber.type';

export const getSberRank = async (codename: string) => {
  const statusMessage: IMessageStatus = {
    title: `${codename} all ok`,
    error: null,
  };
  // const period = new Date().getTime();
  const data = await requestAxiosBank({
    url: 'https://www.sber-bank.by/rates/rates.json',
  })
    .then((res) => res.find((item) => item['ratescard']).ratescard.data)
    .then((res: ISberResponce) => {
      statusMessage.title = `${codename} all ok`;
      const transformData = res.rates.list.map((item) => {
        const newData: IRateInBd = {
          codename: '',
          buyiso: '',
          buyrate: '',
          name: '',
          quantity: 0,
          seliso: '',
          selrate: '',
          address: 'main',
          type: 'main',
          coord: 'main',
        };
        // if (item.codeTo._text === 'BYN' && item.cacheless._text === '0') {
        switch (item.iso) {
          case 'EUR':
            newData.codename = codename;
            newData.name = CONSTANS__TYPE_MONEY.EUR;
            newData.quantity = 1;
            newData.buyiso = 'BYN';
            newData.buyrate = item.sale.toLocaleString();
            newData.seliso = item.iso;
            newData.selrate = item.buy.toLocaleString();
            break;
          case 'USD':
            newData.codename = codename;
            newData.name = CONSTANS__TYPE_MONEY.USD;
            newData.quantity = 1;
            newData.buyiso = 'BYN';
            newData.buyrate = item.sale.toLocaleString();
            newData.seliso = item.iso;
            newData.selrate = item.buy.toLocaleString();
            break;
          case 'RUB':
            newData.codename = codename;
            newData.name = CONSTANS__TYPE_MONEY.RUB;
            newData.quantity = 100;
            newData.buyiso = 'BYN';
            newData.buyrate = item.sale.toLocaleString();
            newData.seliso = item.iso;
            newData.selrate = item.buy.toLocaleString();
            break;
          default:
            break;
        }
        // }

        return newData;
      });
      return transformData.filter((item) => item.codename);
    })
    .catch((err) => {
      console.log(err);

      statusMessage.title = `${codename} something happens`;
      statusMessage.error = err;
    });

  return { data: data, message: statusMessage };
};
