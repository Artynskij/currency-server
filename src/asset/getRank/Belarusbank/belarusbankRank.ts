import { requestAxiosBank } from '../../axios';

import { IBelarusbankItem } from './belarusbank.type';
import {
  IMessageStatus,
  IRateInBd,
  IResponseAxios,
} from '../../types/commonTypes';
import { CONSTANS__TYPE_MONEY } from 'src/asset/utils/isoBanks';

export const getBelarusbankRank = async (
  codeName: string,
): Promise<IResponseAxios> => {
  const statusMessage: IMessageStatus = {
    title: `${codeName} all ok`,
    error: null,
  };
  const data = await requestAxiosBank({
    url: 'https://belarusbank.by/api/kursExchange?city=Дружный',
  })
    .then((res) => res[0])
    .then((res: IBelarusbankItem) => {
      const transformData: IRateInBd[] = [
        {
          codename: codeName,
          buyiso: 'BYN',
          buyrate: res.EUR_out,
          name: CONSTANS__TYPE_MONEY.EUR,
          quantity: 1,
          seliso: 'EUR',
          selrate: res.EUR_in,
        },
        {
          codename: codeName,
          buyiso: 'BYN',
          buyrate: res.USD_out,
          name: CONSTANS__TYPE_MONEY.USD,
          quantity: 1,
          seliso: 'USD',
          selrate: res.USD_in,
        },
        {
          codename: codeName,
          buyiso: 'BYN',
          buyrate: res.RUB_out,
          name: CONSTANS__TYPE_MONEY.RUB,
          quantity: 100,
          seliso: 'RUB',
          selrate: res.RUB_in,
        },
        {
          codename: codeName,
          buyiso: 'RUB',
          buyrate: res.RUB_EUR_out,
          name: null,
          quantity: 1,
          seliso: 'EUR',
          selrate: (+res.RUB_EUR_in * 100).toString(),
        },
        {
          codename: codeName,
          buyiso: 'RUB',
          buyrate: (+res.USD_RUB_out * 100).toString(),
          name: null,
          quantity: 1,
          seliso: 'USD',
          selrate: res.USD_RUB_in,
          //somne
        },
        {
          codename: codeName,
          buyiso: 'USD',
          buyrate: res.USD_EUR_out,
          name: null,
          quantity: 1,
          seliso: 'EUR',
          selrate: res.USD_EUR_in,
        },
      ];
      statusMessage.title = `${codeName} all ok`;
      return transformData;
    })
    .catch((err) => {
      statusMessage.title = `${codeName} something happens`;
      statusMessage.error = err;
    });
  return { data: data, message: statusMessage };
};
