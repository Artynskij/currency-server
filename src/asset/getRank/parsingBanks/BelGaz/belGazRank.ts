import jsdom = require('jsdom');
import { requestAxiosBank } from '../../axios';

import { IMessageStatus, IRateInBd } from 'src/asset/types/commonTypes';
import { CONSTANS__TYPE_MONEY } from 'src/asset/utils/isoBanks';
import { paritet__valute } from '../utilsParsingBanks';
const { JSDOM } = jsdom;

export const getBelGazRank = async (codename: string) => {
  const statusMessage: IMessageStatus = {
    title: `${codename} all ok`,
    error: null,
  };

  const data = await requestAxiosBank({
    url: 'https://belgazprombank.by/',
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
      const block = dom.window.document.querySelector('#curr-tab-1-01');
      const linesTable = block.querySelectorAll('tr');

      linesTable.forEach((line) => {
        switch (line.getAttribute('data-currency')) {
          case 'USD':
            line.querySelectorAll('span').forEach((cell) => {
              cell.getAttribute('data-type') === 'BUY'
                ? (newDataUSD.selrate = cell.innerHTML)
                : cell.getAttribute('data-type') === 'SELL'
                ? (newDataUSD.buyrate = cell.innerHTML)
                : 'nothing';
            });
            break;
          case 'EUR':
            line.querySelectorAll('span').forEach((cell) => {
              cell.getAttribute('data-type') === 'BUY'
                ? (newDataEUR.selrate = cell.innerHTML)
                : cell.getAttribute('data-type') === 'SELL'
                ? (newDataEUR.buyrate = cell.innerHTML)
                : 'nothing';
            });
            break;
          case 'RUB':
            line.querySelectorAll('span').forEach((cell) => {
              cell.getAttribute('data-type') === 'BUY'
                ? (newDataRUB.selrate = cell.innerHTML)
                : cell.getAttribute('data-type') === 'SELL'
                ? (newDataRUB.buyrate = cell.innerHTML)
                : 'nothing';
            });
            break;

          default:
            break;
        }
      });

      //   const spansEur = block.querySelector(`#${paritet__valute.EUR.id}`);

      //   const spansUsd = block.querySelector(`#${paritet__valute.USD.id}`);

      //   const spansRub = block.querySelector(`#${paritet__valute.RUB.id}`);

      //   newDataUSD.selrate = spansUsd.querySelectorAll('span')[1].innerHTML;
      //   newDataUSD.buyrate = spansUsd.querySelectorAll('span')[2].innerHTML;

      //   newDataEUR.selrate = spansEur.querySelectorAll('span')[1].innerHTML;
      //   newDataEUR.buyrate = spansEur.querySelectorAll('span')[2].innerHTML;

      //   newDataRUB.selrate = spansRub.querySelectorAll('span')[1].innerHTML;
      //   newDataRUB.buyrate = spansRub.querySelectorAll('span')[2].innerHTML;
      return [newDataUSD, newDataEUR, newDataRUB];
    })
    .catch((err) => {
      console.log('error parsing');
      statusMessage.title = `${codename} something happens (parsing)`;
      statusMessage.error = err;
    });
  return { data: data, message: statusMessage };
};
