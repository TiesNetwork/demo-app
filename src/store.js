/* eslint-disable */
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';

// Reducer
import { reducer as form } from 'redux-form';

import services from '@services/reducer';
import views from '@views/reducer';

const reducer: Object = combineReducers({
  form,
  services,
  views,
});

const composeEnhancers: Function =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

export default (): Object => createStore(reducer, composeEnhancers());
