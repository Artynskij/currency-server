export interface IAlfaItem {
  sellRate: number;
  sellIso: string;
  sellCode: number;
  buyRate: number;
  buyIso: string;
  buyCode: string;
  quantity: number;
  name: string | null;
  date: string;
}
export interface IAlfaResponce {
  rates: IAlfaItem[];
}
