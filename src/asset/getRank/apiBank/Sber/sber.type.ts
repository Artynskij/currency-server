export interface ISberItem {
  rateType: string;
  iso: string;
  isoName: string;
  isoType: string;
  iso2: null | string | number;
  buy: number;
  deltaBuy: number;
  sale: number;
  deltaSale: number;
  minsum: null | string | number;
  maxsum: null | string | number;
  scale: null | string | number;
  rate: null | string | number;
  deltaRate: null | string | number;
  idBank: null | string | number;
  bankName: null | string | number;
}
export interface ISberResponce {
  errorInfo: {
    errorCode: string;
    errorDescription: string;
  };
  date: 1701669600000;
  prevDate: 1701442800000;
  nextDate: null | string | number;
  idBranch: string;
  branches: null | string | number;
  rates: {
    list: ISberItem[];
  };
  typeId: number;
}
