import { CONSTANS__TYPE_MONEY } from 'src/asset/utils/isoBanks';
import { IVTBItem } from './VTB.type';
import { requestAxiosBank } from '../../../axios';
import {
  IMessageStatus,
  IRateInBd,
  IResponseAxios,
} from '../../../types/commonTypes';
import { XmlToJs } from '../../xmlToJs';

// import { IAlfaResponce } from './alfaBank.type';

export const getVTBRank = async (codename: string): Promise<IResponseAxios> => {
  const statusMessage: IMessageStatus = {
    title: `${codename} all ok`,
    error: null,
  };
  const data = await requestAxiosBank({
    url: 'https://www.vtb.by/sites/default/files/rates.xml',
  })
    .then((res) => XmlToJs(res).rates.main.rate)
    .then((res: IVTBItem[]) => {
      // return res;
      const transformData = res.map((item) => {
        const newData: IRateInBd = {
          codename: '',
          buyiso: '',
          buyrate: '',
          name: '',
          quantity: 0,
          seliso: '',
          selrate: '',
        };
        switch (item.code._text) {
          case 'eur':
            newData.codename = codename;
            newData.name = CONSTANS__TYPE_MONEY.EUR;
            newData.quantity = 1;
            newData.buyiso = 'BYN';
            newData.buyrate = item.sell._text;
            newData.seliso = 'EUR';
            newData.selrate = item.buy._text;
            break;
          case 'usd':
            newData.codename = codename;
            newData.name = CONSTANS__TYPE_MONEY.USD;
            newData.quantity = 1;
            newData.buyiso = 'BYN';
            newData.buyrate = item.sell._text;
            newData.seliso = 'USD';
            newData.selrate = item.buy._text;
            break;
          case 'rub':
            newData.codename = codename;
            newData.name = CONSTANS__TYPE_MONEY.RUB;
            newData.quantity = 100;
            newData.buyiso = 'BYN';
            newData.buyrate = item.sell._text;
            newData.seliso = 'RUB';
            newData.selrate = item.buy._text;
            break;
          default:
            break;
        }
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
