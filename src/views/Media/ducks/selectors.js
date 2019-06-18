import { get } from 'lodash';

const ROOT_PATH = 'views.media';

export const getSelectedId: Function = (state: Object): string =>
  get(state, `${ROOT_PATH}.selectedId`);
