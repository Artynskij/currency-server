import axios from 'axios';

import jsdom = require('jsdom');
import { banksMyfin } from './utils';
import { IRateInBd } from 'src/asset/types/commonTypes';
import { CONSTANS__TYPE_MONEY } from 'src/asset/utils/isoBanks';
const { JSDOM } = jsdom;

export const parcingMyfin = async () => {
  const updatedBanks = [];

  const message = {
    title: `parcingMyfin is ok. Banks: ${banksMyfin.map((item) => item.name)}`,
    error: null,
  };
  const returned: any = await axios
    .get('https://myfin.by/currency/minsk')
    .then((res) => {
      const currentPage = res.data; // Запись полученного результата
      const dom = new JSDOM(currentPage);

      function getRankRow(bank: { localId: number; name: string }) {
        const newDataUSD: IRateInBd = {
          codename: bank.name,
          buyiso: 'BYN',
          buyrate: '',
          name: CONSTANS__TYPE_MONEY.USD,
          quantity: 1,
          seliso: 'USD',
          selrate: '',
        };
        const newDataEUR: IRateInBd = {
          codename: bank.name,
          buyiso: 'BYN',
          buyrate: '',
          name: CONSTANS__TYPE_MONEY.EUR,
          quantity: 1,
          seliso: 'EUR',
          selrate: '',
        };
        const newDataRUB: IRateInBd = {
          codename: bank.name,
          buyiso: 'BYN',
          buyrate: '',
          name: CONSTANS__TYPE_MONEY.RUB,
          quantity: 100,
          seliso: 'RUB',
          selrate: '',
        };

        const nodeRow = dom.window.document.querySelector(
          `#bank-row-${bank.localId}`,
        );

        const spans = nodeRow?.querySelectorAll(
          '.currencies-courses__currency-cell',
        );
        if (!spans) return;
        const spansText: string[] = [];
        spans.forEach((item, index) => {
          switch (index) {
            case 0:
              newDataUSD.selrate = item.querySelector('span').innerHTML;
              break;
            case 1:
              newDataUSD.buyrate = item.querySelector('span').innerHTML;
              break;
            case 2:
              newDataEUR.selrate = item.querySelector('span').innerHTML;
              break;
            case 3:
              newDataEUR.buyrate = item.querySelector('span').innerHTML;
              break;
            case 4:
              newDataRUB.selrate = item.querySelector('span').innerHTML;
              break;
            case 5:
              newDataRUB.buyrate = item.querySelector('span').innerHTML;
              break;

            default:
              break;
          }
          const text = item.querySelector('span').innerHTML;
          spansText.push(text);
        });
        return [newDataUSD, newDataEUR, newDataRUB];
      }

      const returnedRates = [];
      banksMyfin.map((item) => {
        const newItem = getRankRow(item);
        if (!newItem) return;

        updatedBanks.push(newItem[0].codename);
        returnedRates.push(...newItem);
      });

      const notUpdatedBanks = banksMyfin.filter((falseItem) => {
        return !updatedBanks.find((item) => item === falseItem.name);
      });
      if (notUpdatedBanks) {
        message.title = `parcingMyfin is ok. Banks updated: ${updatedBanks.map(
          (item) => item,
        )}. Banks not updated ${notUpdatedBanks.map((item) => item.name)}`;
      } // в случае ошибок определнных банков

      return returnedRates;
    })
    .catch((err) => {
      console.log('error parsing');
      message.title = 'error parsing';
      message.error = err;
    });

  return { data: returned, message: message };
};
