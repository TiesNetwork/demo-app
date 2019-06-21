import { SET_SESSION } from './types';

// const initialState = JSON.parse(localStorage.getItem('account') || '{}');

export default (state = {}, action) => {
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
