import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

// Components
import Modal from '@components/Modal';

// Containers
import Account from './containers/Account';
import Form from './containers/Form';

// Ducks
import { MAIN_ACCOUNT_MODAL_ID } from './ducks';

// Style
import style from './Main.scss';

// Utils
import { resolveUrl } from '@utils';

// Views
import Media from '@views/Media';

type MainPropsType = {
  match: {
    url: string,
  },
};

const Main = ({ match }: MainPropsType): React.Element<typeof Switch> => (
  <div className={style.Root}>
    <div className={style.Header}>
      <Account />
    </div>

    <div className={style.Container}>
      <Switch>
        <Route component={Media} path={resolveUrl(match.url, '/')} />
      </Switch>
    </div>

    <Modal
      classNames={{ container: style.Modal }} id={MAIN_ACCOUNT_MODAL_ID}
      title="Authorization"
    >
      <Form />
    </Modal>
  </div>
);

export default Main;
export type { MainPropsType };
