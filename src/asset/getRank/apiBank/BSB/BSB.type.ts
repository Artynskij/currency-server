export interface IBSBItem {
  buyAmount: number;
  sellAmount: number;
  scaledBuyAmount: string;
  scaledSellAmount: string;
  buyAmountDelta: string;
  sellAmountDelta: string;
  buyCurrencyName: string;
  sellCurrencyName: string;
  buyCurrencyDescription: string;
  sellCurrencyDescription: string;
  buyCurrencyScale: number;
}
export interface IBSBResponce {
  fromTime: null | number;
  nextTime: null | number;
  previousTime: null | number;

  rates: IBSBItem[];
}
