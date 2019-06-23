import classNames from 'classnames';
import * as React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';

// Components
import Button from '@components/Button';

// Ducks
import { MEDIA_UPLOAD_MODAL_ID } from '@views/Media/ducks';

// Services
import { openModal } from '@services/modals';

// Style
import style from './Empty.scss';

type MediaEmptyPropTypes = {
  handleUpload: Function,
  loading: boolean,
  onUpdate: Function,
};

const MediaEmpty = ({
  handleUpload,
  loading,
  onUpdate,
}: MediaEmptyPropTypes): React.Element<'div'> => (
  <div className={style.Root}>
    <div className={style.Container}>
      <div className={style.Logo}>
        <i className={classNames(style.Icon, 'fas fa-file-search')} />
      </div>

      <div className={style.Title}>Media library empty!</div>
      <div className={style.Description}>
        but you can be the first to upload a file.
      </div>

      <div className={style.Actions}>
        {onUpdate && (
          <Button
            icon="fas fa-sync-alt"
            loading={loading}
            onClick={onUpdate}
            variant="outline"
          >
            Sync
          </Button>
        )}

        <Button
          color="success"
          disabled={loading}
          icon="fas fa-cloud-upload-alt"
          onClick={handleUpload}
        >
          Upload file
        </Button>
      </div>
    </div>
  </div>
);

export default compose(
  connect(
    null,
    { openModal },
  ),
  withHandlers({
    handleUpload: ({ openModal }: MediaEmptyPropTypes): Function => () =>
      openModal(MEDIA_UPLOAD_MODAL_ID),
  }),
)(MediaEmpty);
export type { MediaEmptyPropTypes };
