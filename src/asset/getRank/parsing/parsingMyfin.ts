import axios from 'axios';

import { banksMyfin } from './utils';
import { IRateInBd } from 'src/asset/types/commonTypes';
import { CONSTANS__TYPE_MONEY } from 'src/asset/utils/isoBanks';
import jsdom = require('jsdom');
const { JSDOM } = jsdom;

export const parsingMyfin = async () => {
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

      function getRankRowMain(bank: { localId: number; name: string }) {
        const newDataUSD: IRateInBd = {
          codename: bank.name,
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
          codename: bank.name,
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
          codename: bank.name,
          buyiso: 'BYN',
          buyrate: '',
          name: CONSTANS__TYPE_MONEY.RUB,
          quantity: 100,
          seliso: 'RUB',
          selrate: '',
          address: 'main',
          type: 'main',
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
      function getRankFilials(bank: { localId: number; name: string }) {
        const returnedDataFilials = [];
        // нахождение главного блока
        const nodeBlockFilials = dom.window.document
          .querySelector(`#filial-row-${bank.localId}`)
          .querySelector('tbody');
        const nodeRows = nodeBlockFilials?.querySelectorAll('tr');
        // формирование курсов на линии филиала
        nodeRows.forEach((nodeRow) => {
          const newDataUSD: IRateInBd = {
            codename: bank.name,
            buyiso: 'BYN',
            buyrate: '',
            name: CONSTANS__TYPE_MONEY.USD,
            quantity: 1,
            seliso: 'USD',
            selrate: '',
            address: '',
            type: 'filial',
          };
          const newDataEUR: IRateInBd = {
            codename: bank.name,
            buyiso: 'BYN',
            buyrate: '',
            name: CONSTANS__TYPE_MONEY.EUR,
            quantity: 1,
            seliso: 'EUR',
            selrate: '',
            address: '',
            type: 'filial',
          };
          const newDataRUB: IRateInBd = {
            codename: bank.name,
            buyiso: 'BYN',
            buyrate: '',
            name: CONSTANS__TYPE_MONEY.RUB,
            quantity: 100,
            seliso: 'RUB',
            selrate: '',
            address: '',
            type: 'filial',
          };
          newDataUSD.address = nodeRow.querySelector(
            '.currencies-courses__branch-name',
          ).innerHTML;
          newDataEUR.address = nodeRow.querySelector(
            '.currencies-courses__branch-name',
          ).innerHTML;
          newDataRUB.address = nodeRow.querySelector(
            '.currencies-courses__branch-name',
          ).innerHTML;
          const ranksOfRow = nodeRow.querySelectorAll(
            '.currencies-courses__currency-cell',
          );
          newDataUSD.selrate = ranksOfRow[0].querySelector('span').innerHTML;
          newDataUSD.buyrate = ranksOfRow[1].querySelector('span').innerHTML;
          newDataEUR.selrate = ranksOfRow[2].querySelector('span').innerHTML;
          newDataEUR.buyrate = ranksOfRow[3].querySelector('span').innerHTML;
          newDataRUB.selrate = ranksOfRow[4].querySelector('span').innerHTML;
          newDataRUB.buyrate = ranksOfRow[5].querySelector('span').innerHTML;

          returnedDataFilials.push(newDataUSD);
          returnedDataFilials.push(newDataEUR);
          returnedDataFilials.push(newDataRUB);
        });
        return returnedDataFilials;
      }
      const returnedRates = [];

      banksMyfin.map((item) => {
        const newItem = getRankRowMain(item);
        const newItemFilial = getRankFilials(item);
        if (!newItem) return;
        updatedBanks.push(newItem[0].codename);
        returnedRates.push(...newItem);
        returnedRates.push(...newItemFilial);
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
