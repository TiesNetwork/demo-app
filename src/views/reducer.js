import { combineReducers } from 'redux';

// Reducers
import { reducer as media } from './Media';

const viewsReducer = combineReducers({
  media,
});

export default (state = {}, action: Object) => {
  switch (action.type) {
    default:
      return viewsReducer(state, action);
  }
};
