import axios from 'axios';
import { requestAxiosBank } from '../../axios';

import { IMessageStatus, IRateInBd } from '../../../types/commonTypes';
import { IPriorItem, IPriorResponce, IPriorToken } from './Prior.type';
import { IndexPriorValute } from './utils';
import { CONSTANS__TYPE_MONEY } from 'src/asset/utils/isoBanks';

const getTokenPrior = async () => {
  const body = {
    clientID: 'sNiwAiQvjf4TG9YyhzaLvLtaAN0a',
    clientSecret: 'rddEMNj2EU5cpTTnaFlNTfgsCtsa',
  };
  const responce: any = await axios({
    method: 'POST',
    url: 'https://api.priorbank.by:9344/authorize/v2/oauth2/clientCredentials/token',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: body,
  });
  console.log(responce);

  return responce.data;
};

export const getPriorRank = async (codename: string) => {
  const resToken: IPriorToken = await getTokenPrior();

  const statusMessage: IMessageStatus = {
    title: `${codename} all ok`,
    error: null,
  };

  const data = await axios({
    headers: { Authorization: `Bearer ${resToken.accessToken}` },
    url: 'https://api.priorbank.by:9344/currency/v2/prior/rates',
  })
    .then((res) => res.data)
    .then((res: IPriorResponce) => {
      statusMessage.title = `${codename} all ok`;
      const usdObj = res.data.find(
        (item) =>
          item.baseCurrency === IndexPriorValute.USD &&
          item.ratedCurrency === IndexPriorValute.BYN,
      );
      const eurObj = res.data.find(
        (item) =>
          item.baseCurrency === IndexPriorValute.EUR &&
          item.ratedCurrency === IndexPriorValute.BYN,
      );
      const rubObj = res.data.find(
        (item) =>
          item.baseCurrency === IndexPriorValute.RUB &&
          item.ratedCurrency === IndexPriorValute.BYN,
      );
      const returnedData: IRateInBd[] = [
        {
          codename: codename,
          buyiso: 'BYN',
          buyrate: eurObj.rate.sellRate.toString(),
          name: CONSTANS__TYPE_MONEY.EUR,
          quantity: 1,
          seliso: 'EUR',
          selrate: eurObj.rate.buyRate.toString(),
          address: 'main',
          type: 'main',
          coord: 'main',
        },
        {
          codename: codename,
          buyiso: 'BYN',
          buyrate: usdObj.rate.sellRate.toString(),
          name: CONSTANS__TYPE_MONEY.USD,
          quantity: 1,
          seliso: 'USD',
          selrate: usdObj.rate.buyRate.toString(),
          address: 'main',
          type: 'main',
          coord: 'main',
        },
        {
          codename: codename,
          buyiso: 'BYN',
          buyrate: rubObj.rate.sellRate.toString(),
          name: CONSTANS__TYPE_MONEY.RUB,
          quantity: 100,
          seliso: 'RUB',
          selrate: rubObj.rate.buyRate.toString(),
          address: 'main',
          type: 'main',
          coord: 'main',
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
