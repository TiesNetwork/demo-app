import { get, values } from 'lodash';

export const getAccountList: Function = (state: Object): Array<Object> =>
  values(get(state, 'entities.accounts', {}));
