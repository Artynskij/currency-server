export interface IReshenieItem {
  RateCurr: {
    _attributes: {
      bPr: string;
      cPr: string;
      cPrNm: string;
      cPrISO: string;
      bRs: string;
      cRs: string;
      cRsNm: string;
      cRsISO: string;
    };
  };
  RateValue: {
    _attributes: {
      DT: string;
      Inv: string;
      Rate: string;
    };
  };
  RateAdd: {
    _attributes: {
      nPr: string;
      nRs: string;
    };
  };
  RateCommand: {
    _attributes: {
      No: string;
      CommandId: string;
      DT: string;
    };
  };
}
