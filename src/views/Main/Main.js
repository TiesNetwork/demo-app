import { isEmpty } from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { compose, withHandlers } from 'recompose';

// Components
import Button from '@components/Button';

// Containers
import AccountList from './containers/AccountList';
import Confirm from './containers/Confirm';
import Import from './containers/Import';

// Ducks
import {
  MAIN_ACCOUNT_LIST_MODAL_ID,
  MAIN_IMPORT_ACCOUNT_MODAL_ID,
} from './ducks';
import { MEDIA_UPLOAD_MODAL_ID } from '@views/Media/ducks';

// Services
import { openModal } from '@services/modals';
import { getSession } from '@services/session';

// Style
import style from './Main.scss';

// Utils
import { resolveUrl } from '@utils';

// Views
import Media from '@views/Media';

type MainPropsType = {
  handleShowAccounts: Function,
  handleImport: Function,
  handleUpload: Function,
  hasSession: boolean,
  match: {
    url: string,
  },
};

const Main = ({
  handleShowAccounts,
  handleImport,
  handleUpload,
  hasSession,
  match,
}: MainPropsType): React.Element<typeof Switch> => (
  <div className={style.Root}>
    <div className={style.Header}>
      <div className={style.Logo} />

      <div className={style.Actions}>
        {hasSession ? (
          <React.Fragment>
            <Button
              color="primary"
              icon="fas fa-user"
              onClick={handleShowAccounts}
              variant="outline"
            >
              Accounts
            </Button>

            <Button
              color="success"
              icon="fas fa-cloud-upload"
              onClick={handleUpload}
            >
              Upload file
            </Button>
          </React.Fragment>
        ) : (
          <Button
            color="primary" icon="fas fa-user"
            onClick={handleImport}
          >
            Import account
          </Button>
        )}
      </div>
    </div>

    <div className={style.Container}>
      <Switch>
        <Route component={Media} path={resolveUrl(match.url, '/')} />
      </Switch>
    </div>

    <AccountList />
    <Confirm />
    <Import />
  </div>
);

const mapStateToProps = (state: Object) => ({
  hasSession: !isEmpty(getSession(state)),
});

export default compose(
  connect(
    mapStateToProps,
    { openModal },
  ),
  withHandlers({
    handleImport: ({ openModal }): Function =>
      openModal(MAIN_IMPORT_ACCOUNT_MODAL_ID),
    handleShowAccounts: ({ openModal }): Function =>
      openModal(MAIN_ACCOUNT_LIST_MODAL_ID),
    handleUpload: ({ openModal }): Function => () =>
      openModal(MEDIA_UPLOAD_MODAL_ID),
  }),
)(Main);
export type { MainPropsType };
