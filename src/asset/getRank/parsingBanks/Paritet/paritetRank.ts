import jsdom = require('jsdom');
import { requestAxiosBank } from '../../axios';
import { url } from 'inspector';
import { banksMyfin } from '../../parsing/utils';
import { IMessageStatus, IRateInBd } from 'src/asset/types/commonTypes';
import { CONSTANS__TYPE_MONEY } from 'src/asset/utils/isoBanks';
import { paritet__valute } from '../utilsParsingBanks';
const { JSDOM } = jsdom;

export const getParitetRank = async (codename: string) => {
  const updatedBanks = [];

  const statusMessage: IMessageStatus = {
    title: `${codename} all ok`,
    error: null,
  };

  const data = await requestAxiosBank({
    url: 'https://www.paritetbank.by/private/',
  })
    .then((res) => {
      const dom = new JSDOM(res);
      const newDataUSD: IRateInBd = {
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
      const newDataEUR: IRateInBd = {
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
      const newDataRUB: IRateInBd = {
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
      const block = dom.window.document.querySelector('.courses-table');

      const spansUsd = block.querySelector(`#${paritet__valute.USD.id}`);
      const spansEur = block.querySelector(`#${paritet__valute.EUR.id}`);
      const spansRub = block.querySelector(`#${paritet__valute.RUB.id}`);

      newDataUSD.selrate = spansUsd.querySelectorAll('span')[1].innerHTML;
      newDataUSD.buyrate = spansUsd.querySelectorAll('span')[2].innerHTML;

      newDataEUR.selrate = spansEur.querySelectorAll('span')[1].innerHTML;
      newDataEUR.buyrate = spansEur.querySelectorAll('span')[2].innerHTML;

      newDataRUB.selrate = spansRub.querySelectorAll('span')[1].innerHTML;
      newDataRUB.buyrate = spansRub.querySelectorAll('span')[2].innerHTML;
      return [newDataUSD, newDataEUR, newDataRUB];
    })
    .catch((err) => {
      console.log('error parsing');
      statusMessage.title = `${codename} something happens (parsing)`;
      statusMessage.error = err;
    });
  return { data: data, message: statusMessage };
};
