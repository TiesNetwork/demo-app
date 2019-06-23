/* eslint-disable */
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Reducer
import { reducer as form } from 'redux-form';

import entities from '@entities/reducer';
import services from '@services/reducer';
import views from '@views/reducer';

const reducer: Object = combineReducers({
  entities,
  form,
  services,
  views,
});

const persistedReducer = persistReducer(
  { key: 'root', storage, whitelist: ['entities'] },
  reducer,
);

const composeEnhancers: Function =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

export default (): Object => {
  const store = createStore(persistedReducer, composeEnhancers());
  const persistor = persistStore(store);

  return { persistor, store };
};
