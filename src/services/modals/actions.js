import { CLOSE_MODAL, CLOSE_MODALS, OPEN_MODAL } from './types';

export const closeModal: Function = (id: string) => ({ type: CLOSE_MODAL, id });

export const closeModals: Function = () => ({ type: CLOSE_MODALS });

export const openModal: Function = (id: string, payload: Object) => ({
  type: OPEN_MODAL,
  id,
  payload,
});
