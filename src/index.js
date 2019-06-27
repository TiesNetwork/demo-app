import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { createUploadLink } from 'apollo-upload-client';
import { get } from 'lodash';
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

const authLink = setContext((_, { headers }) => {
  try {
    const session: Object = JSON.parse(localStorage.getItem('session'));

    const address: string = get(session, 'address');
    const privateKey: string = get(session, 'privateKey');

    return {
      headers: {
        ...headers,
        authorization: `${address}.${privateKey}`,
      },
    };
  } catch (error) {
    // eslint-disable-next-line
    console.error(error);
  }

  return { headers };
});

const client: ApolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(
    createUploadLink({
      uri: 'http://localhost:3001/graphql',
    }),
  ),
  request: (operation: Object): void => {
    const state: Object = store.getState();

    operation.setContext({
      headers: {
        authorization: getPrivateKey(state),
      },
    });
  },
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
