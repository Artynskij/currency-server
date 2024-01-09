import jsdom = require('jsdom');
import { requestAxiosBank } from '../../axios';

import { IMessageStatus, IRateInBd } from 'src/asset/types/commonTypes';
import { CONSTANS__TYPE_MONEY } from 'src/asset/utils/isoBanks';
import { paritet__valute } from '../utilsParsingBanks';
const { JSDOM } = jsdom;

export const getBelInvestRank = async (codename: string) => {
  const statusMessage: IMessageStatus = {
    title: `${codename} all ok`,
    error: null,
  };

  const data = await requestAxiosBank({
    url: 'https://www.belinvestbank.by/exchange-rates/courses-tab-cashless?town=%D0%9C%D0%B8%D0%BD%D1%81%D0%BA&type=atm&showList=map&display=atm',
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
        coord: 'main',
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
        coord: 'main',
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
        coord: 'main',
      };
      const block = dom.window.document.querySelector('.courses-table__tbody');
      const linesTable = block.querySelectorAll('tr');

      const lineUsd = linesTable[0];

      const lineEur = linesTable[1];

      const lineRub = linesTable[2];

      newDataUSD.selrate = lineUsd
        .querySelector('.courses-table__td_buy')
        .innerHTML.trim();
      newDataUSD.buyrate = lineUsd
        .querySelector('.courses-table__td_sell')
        .innerHTML.trim();

      newDataEUR.selrate = lineEur
        .querySelector('.courses-table__td_buy')
        .innerHTML.trim();
      newDataEUR.buyrate = lineEur
        .querySelector('.courses-table__td_sell')
        .innerHTML.trim();

      newDataRUB.selrate = lineRub
        .querySelector('.courses-table__td_buy')
        .innerHTML.trim();
      newDataRUB.buyrate = lineRub
        .querySelector('.courses-table__td_sell')
        .innerHTML.trim();
      return [newDataUSD, newDataEUR, newDataRUB];
    })
    .catch((err) => {
      console.log('error parsing');
      statusMessage.title = `${codename} something happens (parsing)`;
      statusMessage.error = err;
    });
  return { data: data, message: statusMessage };
};
