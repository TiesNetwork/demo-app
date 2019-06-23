import classNames from 'classnames';
import { isEmpty } from 'lodash';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';

// Components
import Button from '@components/Button';

// Ducks
import { MEDIA_UPLOAD_MODAL_ID } from '@views/Media/ducks';

// Services
import { openModal } from '@services/modals';
import { getSession } from '@services/session';

// Style
import style from './Empty.scss';

type MediaEmptyPropTypes = {
  handleUpload: Function,
  loading: boolean,
  onUpdate: Function,
};

const MediaEmpty = ({
  handleUpload,
  hasSession,
  loading,
  onUpdate,
}: MediaEmptyPropTypes): React.Element<'div'> => (
  <div className={style.Root}>
    <div className={style.Container}>
      <div className={style.Logo}>
        <i className={classNames(style.Icon, 'fas fa-file-search')} />
      </div>

      <div className={style.Title}>
        <FormattedMessage
          defaultMessage="Media library empty!"
          id="media.empty.title"
        />
      </div>

      {hasSession && (
        <div className={style.Description}>
          <FormattedMessage
            defaultMessage="but you can be the first to upload a file."
            id="media.empty.description"
          />
        </div>
      )}

      <div className={style.Actions}>
        {onUpdate && (
          <Button
            icon="fas fa-sync-alt"
            loading={loading}
            onClick={onUpdate}
            variant="outline"
          >
            <FormattedMessage
              defaultMessage="Sync"
              id="media.empty.actions.sync"
            />
          </Button>
        )}

        {hasSession && (
          <Button
            color="success"
            disabled={loading}
            icon="fas fa-cloud-upload-alt"
            onClick={handleUpload}
          >
            <FormattedMessage
              defaultMessage="Upload file"
              id="media.empty.actions.upload"
            />
          </Button>
        )}
      </div>
    </div>
  </div>
);

const mapStateToProps: Function = (state: Object): Object => ({
  hasSession: !isEmpty(getSession(state)),
});

export default compose(
  connect(
    mapStateToProps,
    { openModal },
  ),
  withHandlers({
    handleUpload: ({ openModal }: MediaEmptyPropTypes): Function => () =>
      openModal(MEDIA_UPLOAD_MODAL_ID),
  }),
)(MediaEmpty);
export type { MediaEmptyPropTypes };
