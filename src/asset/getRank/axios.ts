import axios from 'axios';
interface IRequestAxios {
  url: string;
  method?: string;
  API_KEY?: string;
  body?: any;
}
export const requestAxiosBank = async ({
  url: url,
  method: method,
  API_KEY: API_KEY,
  body: body,
}: IRequestAxios) => {
  const { data } = await axios(url);

  return data;
};
