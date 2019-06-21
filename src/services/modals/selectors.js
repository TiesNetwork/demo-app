import { get } from 'lodash';

export const getModalById: Function = (state: Object, id: string): Object =>
  get(state, `services.modals.${id}`);
