// Types
import { SET_LOCALE } from './types';

export const setLocale: Function = (id: string): Object => ({
  type: SET_LOCALE,
  id,
});
