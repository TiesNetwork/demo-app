// Types
import { CREATE_ACCOUNT, DELETE_ACCOUNT, UPDATE_ACCOUNT } from './types';

export const createAccount: Function = (
  id: string,
  payload: Object,
): Object => ({
  type: CREATE_ACCOUNT,
  id,
  payload,
});

export const deleteAccount: Function = (id: string): Object => ({
  type: DELETE_ACCOUNT,
  id,
});

export const updateAccount: Function = (
  id: string,
  payload: Object,
): Object => ({
  type: UPDATE_ACCOUNT,
  id,
  payload,
});
