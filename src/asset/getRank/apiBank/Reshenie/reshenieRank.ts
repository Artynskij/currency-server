import { CONSTANS__TYPE_MONEY } from 'src/asset/utils/isoBanks';
import { requestAxiosBank } from '../../axios';
import { IBelarusbankItem } from '../Belarusbank/belarusbank.type';
import {
  IMessageStatus,
  IRateInBd,
  IResponseAxios,
} from '../../../types/commonTypes';
import { XmlToJs } from '../../xmlToJs';
import { IReshenieItem } from './reshenie.type';

// import { IAlfaResponce } from './alfaBank.type';

export const getReshenieRank = async (
  codename: string,
): Promise<IResponseAxios> => {
  const statusMessage: IMessageStatus = {
    title: `${codename} all ok`,
    error: null,
  };
  const data = await requestAxiosBank({
    url: 'https://rbank.by/upload/currency_last.xml',
  })
    .then((res) => XmlToJs(res).PS_CASH.RateList.Department[0].RateRec)
    .then((res: IReshenieItem[]) => {
      const transformDataEUR: IRateInBd = {
        codename: codename,
        buyiso: 'BYN',
        buyrate: '',
        name: CONSTANS__TYPE_MONEY.EUR,
        quantity: 1,
        seliso: 'EUR',
        selrate: '',
        address: 'main',
        type: 'main',
      };
      const transformDataUSD: IRateInBd = {
        codename: codename,
        buyiso: 'BYN',
        buyrate: '',
        name: CONSTANS__TYPE_MONEY.USD,
        quantity: 1,
        seliso: 'USD',
        selrate: '',
        address: 'main',
        type: 'main',
      };
      const transformDataRUB: IRateInBd = {
        codename: codename,
        buyiso: 'BYN',
        buyrate: '',
        name: CONSTANS__TYPE_MONEY.RUB,
        quantity: 100,
        seliso: 'RUB',
        selrate: '',
        address: 'main',
        type: 'main',
      };

      res.map((item) => {
        if (
          item.RateCurr._attributes.cPrISO === 'BYN' &&
          item.RateCurr._attributes.bPr === '0'
        ) {
          switch (item.RateCurr._attributes.cRsISO) {
            case 'EUR':
              transformDataEUR.buyrate = item.RateValue._attributes.Rate;
              break;
            case 'USD':
              transformDataUSD.buyrate = item.RateValue._attributes.Rate;
              break;
            case 'RUB':
              transformDataRUB.buyrate = item.RateValue._attributes.Rate;
              break;

            default:
              break;
          }
        }
        if (
          item.RateCurr._attributes.cRsISO === 'BYN' &&
          item.RateCurr._attributes.bPr === '0'
        ) {
          switch (item.RateCurr._attributes.cPrISO) {
            case 'EUR':
              transformDataEUR.selrate = item.RateValue._attributes.Rate;
              break;
            case 'USD':
              transformDataUSD.selrate = item.RateValue._attributes.Rate;
              break;
            case 'RUB':
              transformDataRUB.selrate = item.RateValue._attributes.Rate;
              break;

            default:
              break;
          }
        }
      });
      // res.map((item) => {
      //   const newData: IRateInBd = {
      //     codename: '',
      //     buyiso: '',
      //     buyrate: '',
      //     name: '',
      //     quantity: 0,
      //     seliso: '',
      //     selrate: '',
      //   };
      //   switch (item.RateCurr._attributes) {
      //     case 'EUR':
      //       newData.codename = codename;
      //       newData.name = CONSTANS__TYPE_MONEY.EUR;
      //       newData.quantity = 1;
      //       newData.buyiso = 'BYN';
      //       newData.buyrate = item.RateSell._text;
      //       newData.seliso = 'EUR';
      //       newData.selrate = item.RateBuy._text;
      //       break;
      //     case 'USD':
      //       newData.codename = codename;
      //       newData.name = CONSTANS__TYPE_MONEY.USD;
      //       newData.quantity = 1;
      //       newData.buyiso = 'BYN';
      //       newData.buyrate = item.RateSell._text;
      //       newData.seliso = 'USD';
      //       newData.selrate = item.RateBuy._text;
      //       break;
      //     case 'RUB':
      //       newData.codename = codename;
      //       newData.name = CONSTANS__TYPE_MONEY.RUB;
      //       newData.quantity = 100;
      //       newData.buyiso = 'BYN';
      //       newData.buyrate = item.RateSell._text;
      //       newData.seliso = 'RUB';
      //       newData.selrate = item.RateBuy._text;
      //       break;
      //     // case 'USD(RUB)':
      //     //   newData.codename = codename;
      //     //   newData.name = null;
      //     //   newData.quantity = 1;
      //     //   newData.buyiso = 'USD';
      //     //   newData.buyrate = item.RateSell._text;
      //     //   newData.seliso = 'EUR';
      //     //   newData.selrate = item.RateBuy._text;
      //     //   break;
      //     // case 'EUR(RUB)':
      //     //   newData.codename = codename;
      //     //   newData.name = null;
      //     //   newData.quantity = 1;
      //     //   newData.buyiso = 'RUS';
      //     //   newData.buyrate = item.RateSell._text;
      //     //   newData.seliso = 'EUR';
      //     //   newData.selrate = item.RateBuy._text;
      //     //   break;
      //     // case 'USD/RUB':
      //     //   newData.codename = codename;
      //     //   newData.name = null;
      //     //   newData.quantity = 1;
      //     //   newData.buyiso = 'RUS';
      //     //   newData.buyrate = item.RateSell._text;
      //     //   newData.seliso = 'USD';
      //     //   newData.selrate = item.RateBuy._text;
      //     //   break;
      //     default:
      //       break;
      //   }

      //   return newData;
      // });
      // return transformData.filter((item) => item.codename);
      return [transformDataEUR, transformDataUSD, transformDataRUB];
    })
    .catch((err) => {
      statusMessage.title = `${codename} something happens`;
      statusMessage.error = err;
    });

  return { data: data, message: statusMessage };
};
