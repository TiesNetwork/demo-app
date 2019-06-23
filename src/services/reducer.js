import { combineReducers } from 'redux';

// Reducers
import env from './env';
import modals from './modals';
import session from './session';

const servicesReducer = combineReducers({
  env,
  modals,
  session,
});

export default (state = {}, action: Object) => {
  switch (action.type) {
    default:
      return servicesReducer(state, action);
  }
};
