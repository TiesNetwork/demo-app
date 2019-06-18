// Types
import { SET_SELECTED_ID } from './types';

type MediaReducerType = {
  selectedId: string,
};

const initialState: MediaReducerType = {
  selectedId: null,
};

export default (
  state: MediaReducerType = initialState,
  action,
): MediaReducerType => {
  switch (action.type) {
    case SET_SELECTED_ID:
      return {
        ...state,
        selectedId: action.id,
      };
    default:
      return state;
  }
};

export type { MediaReducerType };
