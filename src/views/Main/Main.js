import { isEmpty } from 'lodash';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { compose, withHandlers } from 'recompose';

// Components
import Button from '@components/Button';
import Language from './components/Language';

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

// Entities
import { getAccountList } from '@entities/accounts';

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
  hasAccount: boolean,
  hasSession: boolean,
  match: {
    url: string,
  },
};

const Main = ({
  handleShowAccounts,
  handleImport,
  handleUpload,
  hasAccount,
  hasSession,
  match,
}: MainPropsType): React.Element<typeof Switch> => (
  <div className={style.Root}>
    <div className={style.Header}>
      <div className={style.Logo} onClick={() => window.location.reload()} />

      <div className={style.HeaderRight}>
        <div className={style.Actions}>
          {hasAccount ? (
            <React.Fragment>
              <Button
                color="primary"
                icon={hasSession ? 'fas fa-user' : 'fas fa-lock-alt'}
                onClick={handleShowAccounts}
                variant="outline"
              >
                <FormattedMessage
                  defaultMessage={hasSession ? 'Accounts' : 'Select account'}
                  id={
                    hasSession ? 'main.actions.accounts' : 'main.actions.select'
                  }
                />
              </Button>

              {hasSession && (
                <Button
                  color="success"
                  icon="fas fa-cloud-upload"
                  onClick={handleUpload}
                >
                  <FormattedMessage
                    defaultMessage="Upload file"
                    id="main.actions.upload"
                  />
                </Button>
              )}
            </React.Fragment>
          ) : (
            <Button
              color="primary" icon="fas fa-user"
              onClick={handleImport}
            >
              <FormattedMessage
                defaultMessage="Import account"
                id="main.actions.import"
              />
            </Button>
          )}
        </div>

        <div className={style.Language}>
          <Language />
        </div>
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
  hasAccount: getAccountList(state).length > 0,
  hasSession: !isEmpty(getSession(state)),
});

export default compose(
  connect(
    mapStateToProps,
    { openModal },
  ),
  withHandlers({
    handleImport: ({ openModal }): Function => (): void =>
      openModal(MAIN_IMPORT_ACCOUNT_MODAL_ID),
    handleShowAccounts: ({ openModal }): Function => (): void =>
      openModal(MAIN_ACCOUNT_LIST_MODAL_ID),
    handleUpload: ({ openModal }): Function => (): void =>
      openModal(MEDIA_UPLOAD_MODAL_ID),
  }),
)(Main);
export type { MainPropsType };
