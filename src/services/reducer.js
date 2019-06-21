import { combineReducers } from 'redux';

// Reducers
import modals from './modals';
import session from './session';

const servicesReducer = combineReducers({
  modals,
  session,
});

export default (state = {}, action: Object) => {
  switch (action.type) {
    default:
      return servicesReducer(state, action);
  }
};
