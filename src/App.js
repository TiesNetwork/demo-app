import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { Route, Switch } from 'react-router-dom';

// i18n
import en from './i18n/en';
import ru from './i18n/ru';

// Style
import style from './App.scss';
import '@fortawesome/fontawesome-pro/css/all.min.css';

// Views
import Main from '@views/Main';

const App = (): React.Element<'div'> => (
  <IntlProvider locale="en" messages={ru}>
    <div className={style.Root}>
      <Switch>
        <Route component={Main} path="/" />
      </Switch>
    </div>
  </IntlProvider>
);

export default App;
