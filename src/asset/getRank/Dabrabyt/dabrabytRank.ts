import { CONSTANS__TYPE_MONEY } from 'src/asset/utils/isoBanks';
import { requestAxiosBank } from '../../axios';
import {
  IMessageStatus,
  IRateInBd,
  IResponseAxios,
} from '../../types/commonTypes';
import { XmlToJs } from '../xmlToJs';
import { IDabrabytItem } from './dabrabyt.type';
// import { IAlfaResponce } from './alfaBank.type';

export const getDabrabytRank = async (
  codename: string,
): Promise<IResponseAxios> => {
  const statusMessage: IMessageStatus = {
    title: `${codename} all ok`,
    error: null,
  };
  const data = await requestAxiosBank({
    url: 'https://bankdabrabyt.by/export_courses.php',
  })
    .then((res) => XmlToJs(res).root.filials.filial[0].rates.value)
    .then((res: IDabrabytItem[]) => {
      const transformData = res.map((item) => {
        const newData: IRateInBd = {
          codename: ' ',
          buyiso: ' ',
          buyrate: ' ',
          name: ' ',
          quantity: 0,
          seliso: ' ',
          selrate: ' ',
        };
        switch (item._attributes.iso) {
          case 'EUR':
            newData.codename = codename;
            newData.name = CONSTANS__TYPE_MONEY.EUR;
            newData.quantity = 1;
            newData.buyiso = 'BYN';
            newData.buyrate = item._attributes.sale;
            newData.seliso = item._attributes.iso;
            newData.selrate = item._attributes.buy;
            break;
          case 'USD':
            newData.codename = codename;
            newData.name = CONSTANS__TYPE_MONEY.USD;
            newData.quantity = 1;
            newData.buyiso = 'BYN';
            newData.buyrate = item._attributes.sale;
            newData.seliso = item._attributes.iso;
            newData.selrate = item._attributes.buy;
            break;
          case 'RUB':
            newData.codename = codename;
            newData.name = CONSTANS__TYPE_MONEY.RUB;
            newData.quantity = 100;
            newData.buyiso = 'BYN';
            newData.buyrate = (+item._attributes.sale * 100).toString();
            newData.seliso = item._attributes.iso;
            newData.selrate = (+item._attributes.buy * 100).toString();
            break;
          case 'USD/EUR':
            newData.codename = codename;
            newData.name = null;
            newData.quantity = 1;
            newData.buyiso = 'USD';
            newData.buyrate = item._attributes.buy;
            newData.seliso = 'EUR';
            newData.selrate = item._attributes.sale;
            break;
          case 'EUR/RUB':
            newData.codename = codename;
            newData.name = null;
            newData.quantity = 1;
            newData.buyiso = 'RUS';
            newData.buyrate = item._attributes.sale;
            newData.seliso = 'EUR';
            newData.selrate = item._attributes.buy;
            break;
          case 'USD/RUB':
            newData.codename = codename;
            newData.name = null;
            newData.quantity = 1;
            newData.buyiso = 'RUS';
            newData.buyrate = item._attributes.sale;
            newData.seliso = 'USD';
            newData.selrate = item._attributes.buy;
            break;
          default:
            break;
        }
        return newData;
      });
      return transformData;
    })
    .catch((err) => {
      statusMessage.title = `${codename} something happens`;
      statusMessage.error = err;
    });

  return { data: data, message: statusMessage };
};
