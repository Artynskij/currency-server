import { CONSTANS__TYPE_MONEY } from 'src/asset/utils/isoBanks';
import { requestAxiosBank } from '../../axios';
import { IBelarusbankItem } from '../Belarusbank/belarusbank.type';
import {
  IMessageStatus,
  IRateInBd,
  IResponseAxios,
} from '../../../types/commonTypes';
import { XmlToJs } from '../../xmlToJs';
import { IBelagroItem } from './belagro.type';

// import { IAlfaResponce } from './alfaBank.type';

export const getBelagroRank = async (codename: string) => {
  // Promise<IResponseAxios>
  const statusMessage: IMessageStatus = {
    title: `${codename} all ok`,
    error: null,
  };
  const data = await requestAxiosBank({
    url: 'https://belapb.by/CashExRatesDaily.php',
  })
    .then((res) => XmlToJs(res).DailyExRates.Currency)
    .then((res: IBelagroItem[]) => {
      if (!res) {
        statusMessage.title = `${codename} don't have data`;
        statusMessage.error = 'empty array';
        return;
      }
      // return res;
      const filterRes = res.filter((item) => item._attributes.Id === '1216');
      const transformData = filterRes.map((item) => {
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
        };
        switch (item.CharCode._text) {
          case 'EUR':
            newData.codename = codename;
            newData.name = CONSTANS__TYPE_MONEY.EUR;
            newData.quantity = 1;
            newData.buyiso = 'BYN';
            newData.buyrate = item.RateSell._text;
            newData.seliso = item.CharCode._text;
            newData.selrate = item.RateBuy._text;
            break;
          case 'USD':
            newData.codename = codename;
            newData.name = CONSTANS__TYPE_MONEY.USD;
            newData.quantity = 1;
            newData.buyiso = 'BYN';
            newData.buyrate = item.RateSell._text;
            newData.seliso = item.CharCode._text;
            newData.selrate = item.RateBuy._text;
            break;
          case 'RUB':
            newData.codename = codename;
            newData.name = CONSTANS__TYPE_MONEY.RUB;
            newData.quantity = 100;
            newData.buyiso = 'BYN';
            newData.buyrate = item.RateSell._text;
            newData.seliso = item.CharCode._text;
            newData.selrate = item.RateBuy._text;
            break;
          // case 'USD(RUB)':
          //   newData.codename = codename;
          //   newData.name = null;
          //   newData.quantity = 1;
          //   newData.buyiso = 'USD';
          //   newData.buyrate = item.RateSell._text;
          //   newData.seliso = 'EUR';
          //   newData.selrate = item.RateBuy._text;
          //   break;
          // case 'EUR(RUB)':
          //   newData.codename = codename;
          //   newData.name = null;
          //   newData.quantity = 1;
          //   newData.buyiso = 'RUS';
          //   newData.buyrate = item.RateSell._text;
          //   newData.seliso = 'EUR';
          //   newData.selrate = item.RateBuy._text;
          //   break;
          // case 'USD/RUB':
          //   newData.codename = codename;
          //   newData.name = null;
          //   newData.quantity = 1;
          //   newData.buyiso = 'RUS';
          //   newData.buyrate = item.RateSell._text;
          //   newData.seliso = 'USD';
          //   newData.selrate = item.RateBuy._text;
          //   break;
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
