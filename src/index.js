import ApolloClient from 'apollo-boost';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';

// Services
import { getPrivateKey } from '@services/session';

// Store
import createStore from './store';

// Utils
import * as serviceWorker from '@utils/serviceWorker';

// Views
import App from './App';

const { persistor, store } = createStore();
const client = new ApolloClient({
  request: (operation: Object): void => {
    const state: Object = store.getState();

    operation.setContext({
      headers: {
        authorization: getPrivateKey(state),
      },
    });
  },
  uri: 'http://localhost:3001/graphql',
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </ApolloProvider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
