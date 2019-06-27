// Types
import { SET_LOCALE } from './types';

const initialState = {
  locale: localStorage.getItem('locale') || 'en',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_LOCALE:
      return {
        ...state,
        locale: action.id,
      };
    default:
      return state;
  }
};
