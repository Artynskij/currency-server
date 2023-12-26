import jsdom = require('jsdom');
import { requestAxiosBank } from '../../axios';
import { url } from 'inspector';
import { banksMyfin } from '../../parsing/utils';
import { IMessageStatus, IRateInBd } from 'src/asset/types/commonTypes';
import { CONSTANS__TYPE_MONEY } from 'src/asset/utils/isoBanks';
import { paritet__valute } from '../utilsParsingBanks';
const { JSDOM } = jsdom;

export const getBNBRank = async (codename: string) => {
  const updatedBanks = [];

  const statusMessage: IMessageStatus = {
    title: `${codename} all ok`,
    error: null,
  };

  const data = await requestAxiosBank({
    url: 'https://bnb.by/o-lichnom/obsluzhivanie/obmen-valyut/',
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
      const block = dom.window.document
        .querySelector('.currency__table')
        .querySelector('tbody');
      const linesTable = block.querySelectorAll('tr');
      const spansUsd = linesTable[0].querySelectorAll('.js-action_chtext');
      const spansEur = linesTable[1].querySelectorAll('.js-action_chtext');

      const spansRub = linesTable[2].querySelectorAll('.js-action_chtext');

      newDataUSD.selrate = spansUsd[0].innerHTML;
      newDataUSD.buyrate = spansUsd[1].innerHTML;

      newDataEUR.selrate = spansEur[0].innerHTML;
      newDataEUR.buyrate = spansEur[1].innerHTML;

      newDataRUB.selrate = spansRub[0].innerHTML;
      newDataRUB.buyrate = spansRub[1].innerHTML;
      return [newDataUSD, newDataEUR, newDataRUB];
    })
    .catch((err) => {
      console.log('error parsing');
      statusMessage.title = `${codename} something happens (parsing)`;
      statusMessage.error = err;
    });
  return { data: data, message: statusMessage };
};
