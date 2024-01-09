import jsdom = require('jsdom');
import { requestAxiosBank } from '../../axios';

import { IMessageStatus, IRateInBd } from 'src/asset/types/commonTypes';
import { CONSTANS__TYPE_MONEY } from 'src/asset/utils/isoBanks';
import { paritet__valute } from '../utilsParsingBanks';
import axios from 'axios';
const { JSDOM } = jsdom;

export const getExpertRank = async (codename: string) => {
  const statusMessage: IMessageStatus = {
    title: `${codename} all ok`,
    error: null,
  };

  const data = await axios({
    url: 'https://www.incass-expert.by/wps/portal/nkfo/company/exchange',
    // headers: {
    //   'Transfer-Encoding': 'chunked',
    //   'Content-Type': 'text/html; charset=UTF-8',
    // },
  })
    .then((res) => {
      // const dom = new JSDOM(res);
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
      // const block = dom.window.document.querySelector('.wpthemeControlBody ');
      // const linesTable = block.querySelectorAll('tr');

      // const lineUsd = linesTable[3].querySelectorAll('td');
      // const lineEur = linesTable[2].querySelectorAll('td');
      // const lineRub = linesTable[4].querySelectorAll('td');

      // console.log(lineUsd[2].querySelector('p').innerHTML);

      // newDataUSD.selrate = spansUsd[0].innerHTML;
      // newDataUSD.buyrate = spansUsd[1].innerHTML;

      // newDataEUR.selrate = spansEur.querySelectorAll('span')[1].innerHTML;
      // newDataEUR.buyrate = spansEur.querySelectorAll('span')[2].innerHTML;

      // newDataRUB.selrate = spansRub.querySelectorAll('span')[1].innerHTML;
      // newDataRUB.buyrate = spansRub.querySelectorAll('span')[2].innerHTML;
      return [newDataUSD, newDataEUR, newDataRUB];
    })
    .catch((err) => {
      console.log('error parsing');
      statusMessage.title = `${codename} something happens (parsing)`;
      statusMessage.error = err;
    });
  return { data: data, message: statusMessage };
};
