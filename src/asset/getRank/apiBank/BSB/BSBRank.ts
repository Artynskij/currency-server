import axios from 'axios';
import { requestAxiosBank } from '../../../axios';

import { IMessageStatus, IRateInBd } from '../../../types/commonTypes';
import { IBSBResponce } from './BSB.type';
import { CONSTANS__TYPE_MONEY } from 'src/asset/utils/isoBanks';

export const getBSBRank = async (codename: string) => {
  const statusMessage: IMessageStatus = {
    title: `${codename} all ok`,
    error: null,
  };
  const period = new Date().getTime();
  const data = await axios({
    method: 'POST',
    url: 'https://mobile.bsb.by/api/v1/free-zone-management/exchange-rates/rates',
    data: {
      bankDepartmentId: 7,
      period: period,
      type: 'CASH',
    },
  })
    .then((res) => res.data)
    .then((res: IBSBResponce) => {
      statusMessage.title = `${codename} all ok`;
      const usdObj = res.rates.find(
        (item) =>
          item.buyCurrencyName === 'USD' && item.sellCurrencyName === 'BYN',
      );
      const eurObj = res.rates.find(
        (item) =>
          item.buyCurrencyName === 'EUR' && item.sellCurrencyName === 'BYN',
      );
      const rubObj = res.rates.find(
        (item) =>
          item.buyCurrencyName === 'RUB' && item.sellCurrencyName === 'BYN',
      );
      const returnedData: IRateInBd[] = [
        {
          codename: codename,
          buyiso: 'BYN',
          buyrate: eurObj.sellAmount.toString(),
          name: CONSTANS__TYPE_MONEY.EUR,
          quantity: 1,
          seliso: 'EUR',
          selrate: eurObj.buyAmount.toString(),
        },
        {
          codename: codename,
          buyiso: 'BYN',
          buyrate: usdObj.sellAmount.toString(),
          name: CONSTANS__TYPE_MONEY.USD,
          quantity: 1,
          seliso: 'USD',
          selrate: usdObj.buyAmount.toString(),
        },
        {
          codename: codename,
          buyiso: 'BYN',
          buyrate: (rubObj.sellAmount * 100).toString(),
          name: CONSTANS__TYPE_MONEY.RUB,
          quantity: 100,
          seliso: 'RUB',
          selrate: (rubObj.buyAmount * 100).toString(),
        },
      ];
      return returnedData;
    })
    .catch((err) => {
      statusMessage.title = `${codename} something happens`;
      statusMessage.error = err;
    });

  return { data: data, message: statusMessage };
};
