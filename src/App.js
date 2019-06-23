import { get } from 'lodash';
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

// i18n
import en from './i18n/en';
import ru from './i18n/ru';

// Serices
import { getLocale } from '@services/env';

// Style
import style from './App.scss';
import '@fortawesome/fontawesome-pro/css/all.min.css';

// Views
import Main from '@views/Main';

const LOCALE = {
  en,
  ru,
};

const App = ({ locale }): React.Element<'div'> => (
  <IntlProvider locale="en" messages={get(LOCALE, locale, LOCALE.en)}>
    <div key={locale} className={style.Root}>
      <Switch>
        <Route component={Main} path="/" />
      </Switch>
    </div>
  </IntlProvider>
);

const mapStateToProps = (state: Object) => ({
  locale: getLocale(state),
});

export default connect(mapStateToProps)(App);
