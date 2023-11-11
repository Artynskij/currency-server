import { CONSTANS__TYPE_MONEY } from 'src/asset/utils/isoBanks';
import { requestAxiosBank } from '../../../axios';
import { IBelarusbankItem } from '../Belarusbank/belarusbank.type';
import {
  IMessageStatus,
  IRateInBd,
  IResponseAxios,
} from '../../../types/commonTypes';
import { XmlToJs } from '../../xmlToJs';
import { IMTBItem } from './MTB.type';

// import { IAlfaResponce } from './alfaBank.type';

export const getMTBRank = async (codename: string) => {
  // : Promise<IResponseAxios>
  const statusMessage: IMessageStatus = {
    title: `${codename} all ok`,
    error: null,
  };
  const data = await requestAxiosBank({
    url: 'https://www.mtbank.by/currxml.php',
  })
    .then((res) => XmlToJs(res).rates.currency)
    .then((res: IMTBItem[]) => {
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
        if (item.codeTo._text === 'BYN' && item.cacheless._text === '0') {
          switch (item.code._text) {
            case 'EUR':
              newData.codename = codename;
              newData.name = CONSTANS__TYPE_MONEY.EUR;
              newData.quantity = 1;
              newData.buyiso = item.codeTo._text;
              newData.buyrate = item.sale._text;
              newData.seliso = item.code._text;
              newData.selrate = item.purchase._text;
              break;
            case 'USD':
              newData.codename = codename;
              newData.name = CONSTANS__TYPE_MONEY.USD;
              newData.quantity = 1;
              newData.buyiso = item.codeTo._text;
              newData.buyrate = item.sale._text;
              newData.seliso = item.code._text;
              newData.selrate = item.purchase._text;
              break;
            case 'RUB':
              newData.codename = codename;
              newData.name = CONSTANS__TYPE_MONEY.RUB;
              newData.quantity = 100;
              newData.buyiso = item.codeTo._text;
              newData.buyrate = item.sale._text;
              newData.seliso = item.code._text;
              newData.selrate = item.purchase._text;
              break;
            default:
              break;
          }
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
