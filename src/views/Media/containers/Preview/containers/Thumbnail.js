import classNames from 'classnames';
import { get } from 'lodash';
import * as React from 'react';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { compose, withHandlers, withState } from 'recompose';

// Components
import Button from '@components/Button';

// Ducks
import { MEDIA_CONTENT_MODAL_ID } from '@views/Media/ducks';

// GraphQL
import updateThumbnail from '@views/Media/graphql/updateThumbnail.graphql';

// Services
import { openModal } from '@services/modals';

// Style
import style from './Thumbnail.scss';

// Utils
import { getFileIcon } from '@utils';

const MediaPreviewThumbnail = ({
  handleChange,
  handlePlay,
  isLoading,
  isOwner,
  name,
  mimetype,
  thumbnail,
}) => {
  const type: string = mimetype.split('/')[0];

  return (
    <div
      className={classNames(
        style.Root,
        { [style.RootIsEmpty]: !thumbnail },
        {
          [style.RootVariantAudio]: type === 'audio',
          [style.RootVariantVideo]: type === 'video',
        },
      )}
    >
      <div className={style.Cover}>
        {thumbnail ? (
          <img
            alt={name}
            className={style.Image}
            src={`data:${mimetype};base64,${thumbnail}`}
          />
        ) : (
          <i className={classNames(style.Icon, 'fas', getFileIcon(mimetype))} />
        )}
      </div>

      <div className={style.Actions}>
        {isLoading ? (
          <div className={style.Loading}>
            <i className="fas fa-spinner-third" />
          </div>
        ) : (
          <React.Fragment>
            {['audio', 'image', 'video'].indexOf(type) > -1 && (
              <Button
                className={style.Button}
                icon={classNames('fas', {
                  'fa-play': type !== 'image',
                  'fa-search': type === 'image',
                })}
                onClick={handlePlay}
              />
            )}

            {isOwner && (
              <label className={style.Upload} htmlFor="uploadThubmnail">
                <i className="fas fa-image" />
                <input
                  accept="image/jpeg,image/png"
                  id="uploadThubmnail"
                  onChange={handleChange}
                  type="file"
                />
              </label>
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default compose(
  graphql(updateThumbnail, { name: 'updateThumbnail' }),
  connect(
    null,
    { openModal },
  ),
  withState('isLoading', 'setLoading', false),
  withHandlers({
    handleChange: ({ id, setLoading, updateThumbnail }) => (
      event: SyntheticEvent,
    ): void => {
      const file = get(event, 'target.files.0');

      if (file) {
        setLoading(true);

        updateThumbnail({
          variables: { id, thumbnail: file },
        })
          .then(() => setLoading(false))
          .catch(() => setLoading(false));
      }
    },
    handlePlay: ({ id, name, mimetype, openModal }): Function => (): void =>
      openModal(MEDIA_CONTENT_MODAL_ID, { fileId: id, name, mimetype }),
  }),
)(MediaPreviewThumbnail);
