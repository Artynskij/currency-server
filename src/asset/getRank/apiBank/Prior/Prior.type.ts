export interface IPriorItem {
  channel: number;
  bankUnit: {
    code: number;
    region: number;
    city: number;
    district: number;
  };
  validFrom: string;
  baseCurrency: number;
  baseCurrencyNominal: number;
  baseCurrencyPayType: number;
  ratedCurrency: number;
  ratedCurrencyPayType: number;
  rate: {
    sellRate: number;
    buyRate: number;
  };
}
export interface IPriorMeta {
  offset: number;
  count: number;
  total: number;
  processingDate: string;
}
export interface IPriorResponce {
  meta: IPriorMeta;
  data: IPriorItem[];
}

export interface IPriorToken {
  expiresIn: number;
  accessToken: string;
  tokenType: string;
}
