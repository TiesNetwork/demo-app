import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

// Style
import style from './App.scss';
import '@fortawesome/fontawesome-pro/css/all.min.css';

// Views
import Media from '@views/Media';

const App = (): React.Element<'div'> => (
  <div className={style.Root}>
    <Switch>
      <Route component={Media} path="/" />
    </Switch>
  </div>
);

export default App;
