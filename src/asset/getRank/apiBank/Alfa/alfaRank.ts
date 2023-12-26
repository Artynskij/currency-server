import { requestAxiosBank } from '../../axios';

import { IMessageStatus, IRateInBd } from '../../../types/commonTypes';
import { IAlfaResponce } from './alfaBank.type';

export const getAlfaRank = async (codename: string) => {
  const statusMessage: IMessageStatus = {
    title: `${codename} all ok`,
    error: null,
  };
  const data: IAlfaResponce = await requestAxiosBank({
    url: 'https://developerhub.alfabank.by:8273/partner/1.0.1/public/rates',
  })
    .then((res) => {
      statusMessage.title = `${codename} all ok`;
      return res.rates.map((item) => {
        const codeName = codename;
        const newData: IRateInBd = {
          codename: ' ',
          buyiso: ' ',
          buyrate: ' ',
          name: ' ',
          quantity: 0,
          seliso: ' ',
          selrate: ' ',
          address: 'main',
          type: 'main',
        };
        newData.codename = codeName;
        newData.buyiso = item.buyIso;
        newData.buyrate = item.buyRate.toString();
        newData.name = item.name;
        newData.quantity = item.quantity;
        newData.seliso = item.sellIso;
        newData.selrate = item.sellRate.toString();
        return newData;
      });
    })
    .catch((err) => {
      statusMessage.title = `${codename} something happens`;
      statusMessage.error = err;
    });

  return { data: data, message: statusMessage };
};
