import { SET_SESSION } from './types';

const initialState = JSON.parse(localStorage.getItem('session') || '{}');

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_SESSION:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
