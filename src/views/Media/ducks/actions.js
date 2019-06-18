// Types
import { SET_SELECTED_ID } from './types';

export const setSelectedId = (id: string): Object => ({
  type: SET_SELECTED_ID,
  id,
});
