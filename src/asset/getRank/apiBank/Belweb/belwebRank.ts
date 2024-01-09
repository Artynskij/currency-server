import axios from 'axios';
import { requestAxiosBank } from '../../axios';

import { IMessageStatus, IRateInBd } from '../../../types/commonTypes';
import { IBelwebItem, IBelwebResponce } from './belweb.type';
import { CONSTANS__TYPE_MONEY } from 'src/asset/utils/isoBanks';

export const getBelwebRank = async (codename: string) => {
  const statusMessage: IMessageStatus = {
    title: `${codename} all ok`,
    error: null,
  };
  // const period = new Date().getTime();
  const data = await axios({
    method: 'POST',
    url: 'https://www.belveb.by/rates/',
  })
    .then((res) => res.data.items[0])
    .then((res: IBelwebResponce) => {
      statusMessage.title = `${codename} all ok`;
      const transformData = res.currency.map((item) => {
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
        switch (item.currency_cod) {
          case 'EUR':
            newData.codename = codename;
            newData.name = CONSTANS__TYPE_MONEY.EUR;
            newData.quantity = 1;
            newData.buyiso = 'BYN';
            newData.buyrate = item.sale_rate.value;
            newData.seliso = item.currency_cod;
            newData.selrate = item.buy_rate.value;
            break;
          case 'USD':
            newData.codename = codename;
            newData.name = CONSTANS__TYPE_MONEY.USD;
            newData.quantity = 1;
            newData.buyiso = 'BYN';
            newData.buyrate = item.sale_rate.value;
            newData.seliso = item.currency_cod;
            newData.selrate = item.buy_rate.value;
            break;
          case 'RUB':
            newData.codename = codename;
            newData.name = CONSTANS__TYPE_MONEY.RUB;
            newData.quantity = 100;
            newData.buyiso = 'BYN';
            newData.buyrate = item.sale_rate.value;
            newData.seliso = item.currency_cod;
            newData.selrate = item.buy_rate.value;
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
      statusMessage.title = `${codename} something happens`;
      statusMessage.error = err;
    });

  return { data: data, message: statusMessage };
};
