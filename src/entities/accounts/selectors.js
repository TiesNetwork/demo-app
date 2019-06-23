import { get, values } from 'lodash';

export const getAccountList: Function = (state: Object): Array<Object> =>
  values(get(state, 'entities.accounts', {}));

export const getAccountByAddress: Function = (
  state: Object,
  address: string,
): Object => get(state, `entities.accounts.${address}`);
