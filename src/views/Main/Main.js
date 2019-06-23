import { isEmpty } from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { compose, withHandlers } from 'recompose';

// Components
import Button from '@components/Button';

// Containers
import Import from './containers/Import';

// Ducks
import { MAIN_IMPORT_ACCOUNT_MODAL_ID } from './ducks';
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
  handleLogin: Function,
  handleUpload: Function,
  hasSession: boolean,
  match: {
    url: string,
  },
};

const Main = ({
  handleLogin,
  handleUpload,
  hasSession,
  match,
}: MainPropsType): React.Element<typeof Switch> => (
  <div className={style.Root}>
    <div className={style.Header}>
      <div className={style.Logo} />
      {console.log(hasSession)}
      <div className={style.Actions}>
        <Button
          color="primary"
          icon="fas fa-user"
          onClick={handleUpload}
          variant="outline"
        >
          Accounts
        </Button>

        {hasSession && (
          <Button
            color="success"
            icon="fas fa-cloud-upload"
            onClick={handleUpload}
          >
            Upload file
          </Button>
        )}

        <Button
          color="primary" icon="fas fa-user"
          onClick={handleLogin}
        >
          Import account
        </Button>
      </div>
    </div>

    <div className={style.Container}>
      <Switch>
        <Route component={Media} path={resolveUrl(match.url, '/')} />
      </Switch>
    </div>

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
    handleLogin: ({ openModal }): Function =>
      openModal(MAIN_IMPORT_ACCOUNT_MODAL_ID),
    handleUpload: ({ openModal }): Function => () =>
      openModal(MEDIA_UPLOAD_MODAL_ID),
  }),
)(Main);
export type { MainPropsType };
