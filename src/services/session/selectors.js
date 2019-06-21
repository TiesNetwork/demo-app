import { get } from 'lodash';

export const getSession: Function = (state: Object): Object =>
  get(state, 'services.session');
