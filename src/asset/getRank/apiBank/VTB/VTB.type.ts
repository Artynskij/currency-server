export interface IVTBItem {
  code: {
    _text: string;
  };
  buy: {
    _text: string;
  };
  sell: {
    _text: string;
  };
  ranges: {
    range: {
      _attributes: {
        condition: string;
      };
      buy: {
        _text: string;
      };
      sell: {
        _text: string;
      };
    };
  };
}
