export interface IBankInBd {
  name: string;
  logo: string;
  codename: string;
  idbank: number;
}

export interface IRateInBd {
  codename: string;
  buyrate: string;
  buyiso: string;
  quantity: number;
  name: string | null;
  selrate: string;
  seliso: string;
}

export interface IMessageStatus {
  title: string;
  error: any;
}

export interface IResponseAxios {
  data: IRateInBd[] | void;
  message: IMessageStatus;
}
