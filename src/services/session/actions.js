import { SET_SESSION } from './types';

export const setSession: Function = (payload: Object): Object => ({
  type: SET_SESSION,
  payload,
});
