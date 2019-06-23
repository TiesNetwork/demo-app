import { get, omit } from 'lodash';

// Types
import { CREATE_ACCOUNT, DELETE_ACCOUNT, UPDATE_ACCOUNT } from './types';

export default (state: Object = {}, action: Object): Object => {
  const id = get(action, 'id');
  const account = id && get(state, id);

  switch (action.type) {
    case CREATE_ACCOUNT:
      return {
        ...state,
        [id]: action.payload,
      };
    case DELETE_ACCOUNT:
      return omit(state, action.id);
    case UPDATE_ACCOUNT:
      return {
        ...state,
        [id]: {
          ...account,
          ...action.payload,
        },
      };
    default:
      return state;
  }
};
