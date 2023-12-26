export interface IBelwebItem {
  infoPrompt: boolean;
  currencyPrompt: string;
  currency_img: string;
  currency_qty: string;
  currency_cod: string;
  currency_name: string;
  time: string;
  buy_rate: {
    caption: string;
    value: string;
    dynamics: number;
  };
  sale_rate: {
    caption: string;
    value: string;
    dynamics: string;
  };
}
export interface IBelwebResponce {
  id: string;
  mainCourse: true;
  label: string;
  serviceCenter: string;
  address: string;
  addressUrl: string;
  showAllButton: string;
  allCurrencyLink: {
    caption: string;
    value: string;
  };
  time: [
    {
      value: string;
    },
  ];
  currency: IBelwebItem[];
}
