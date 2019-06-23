import { get } from 'lodash';

export const getLocale = (state: Object): string =>
  get(state, 'services.env.locale');
