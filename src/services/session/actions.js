import { SET_SESSION } from './types';

export const setSession: Function = (payload: Object): Object => {
  localStorage.setItem('account', JSON.stringify(payload));

  return {
    type: SET_SESSION,
    payload,
  };
};
