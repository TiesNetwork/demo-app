import classNames from 'classnames';
import { get, isEmpty } from 'lodash';
import moment from 'moment';
import prettyBytes from 'pretty-bytes';
import * as React from 'react';
import { graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';

// Components
import Field from './components/Field';
import Owner from './components/Owner';

// Containers
import Download from './containers/Download';
import Form from './containers/Form';

// Ducks
import { MEDIA_CONTENT_MODAL_ID, setSelectedId } from '@views/Media/ducks';

// GraphQL
import deleteFile from '@views/Media/graphql/deleteFile.graphql';
import downloadFile from '@views/Media/graphql/downloadFile.graphql';
import getFileList from '@views/Media/graphql/getFileList.graphql';
import updateFile from '@views/Media/graphql/updateFile.graphql';

// Services
import { openModal } from '@services/modals';
import { isOwner } from '@services/session';

// Style
import style from './Preview.scss';

type MediaPreviewPropsType = {
  id: string,
  createdAt: Date,
  description: string,
  extension: string,
  handleClose: Function,
  handleDelete: Function,
  handlePlayer: Function,
  handleSubmit: Function,
  hasContent: boolean,
  isOwner: boolean,
  name: string,
  mimetype: string,
  owner: string,
  size: number,
};

type MediaPreviewValueType = {
  id: string,
  description: string,
  name: string,
};

const MediaPreview = ({
  id,
  createdAt,
  extension = '',
  description,
  handleClose,
  handleDelete,
  handleDownload,
  handlePlayer,
  handleSubmit,
  hasContent,
  isOwner,
  mimetype = '',
  name,
  owner,
  size = 0,
  thumbnail,
}: MediaPreviewPropsType): React.Element<'div'> => {
  const type = mimetype.split('/')[0];

  return (
    <div className={style.Root}>
      <div className={style.Header}>
        <FormattedMessage
          defaultMessage="File Preview"
          id="media.preview.title"
        />

        <button
          className={style.Close} onClick={handleClose}
          type="button"
        >
          <i className="fal fa-times" />
        </button>
      </div>

      {['audio', 'image', 'video'].indexOf(type) > -1 && (
        <div
          className={classNames(style.Thumbnail, {
            [style.ThumbnailVariantAudio]: type === 'audio',
            [style.ThumbnailVariantVideo]: type === 'video',
          })}
          onClick={handlePlayer}
        >
          {type === 'audio' && <i className="fas fa-music" />}
          {type === 'video' && <i className="fas fa-film-alt" />}
          {type === 'image' && (
            <img
              alt={name}
              className={style.Image}
              src={`data:${mimetype};base64,${thumbnail}`}
            />
          )}

          {['audio', 'video'].indexOf(type) > -1 && (
            <div className={style.ThumbnailPlay}>
              <i className="fas fa-play" />
            </div>
          )}
        </div>
      )}

      <div className={style.Info}>
        {!isOwner && (
          <Field
            label="media.preview.field.name"
            value={`${name}.${extension}`}
          />
        )}

        <Field label="media.preview.field.type" value={mimetype} />
        <Field
          label="media.preview.field.size"
          value={`${prettyBytes(size)} (${size} Bytes)`}
        />
        <Field
          label="media.preview.field.createdAt"
          value={moment(createdAt).format('MMM DD, YYYY')}
        />
        <Field
          label="media.preview.field.owner"
          value={<Owner address={owner} isOwner={isOwner} />}
        />
      </div>

      <div className={style.Download}>
        <Download onSubmit={handleDownload} />
      </div>

      {isOwner && (
        <div className={style.Form}>
          <Form
            extension={extension}
            form={`file-${id}-form`}
            initialValues={{ id, description, name }}
            onDelete={handleDelete}
            onSubmit={handleSubmit}
          />
        </div>
      )}
    </div>
  );
};

const mapStateToProps: Function = (
  state: Object,
  { owner }: MediaPreviewPropsType,
) => ({
  isOwner: isOwner(state, owner),
});

export default compose(
  connect(
    mapStateToProps,
    { openModal, setSelectedId },
  ),
  graphql(deleteFile, { name: 'deleteFile' }),
  graphql(downloadFile, { name: 'downloadFile' }),
  graphql(updateFile, { name: 'updateFile' }),
  withHandlers({
    handleClose: ({ setSelectedId }): Function => (): void =>
      setSelectedId(null),
    handleDelete: ({
      deleteFile,
      id,
    }: MediaPreviewPropsType): Function => (): Promise =>
      deleteFile({
        refetchQueries: [{ query: getFileList }],
        updateQueries: {
          getFileList: (prev, { mutationResult }) => {
            const id = get(mutationResult, 'data.deleteFile.id');

            return id
              ? {
                ...prev,
                getFileList: prev.getFileList.filter(item => item.id !== id),
              }
              : prev;
          },
        },
        variables: { id },
      }),
    handleDownload: ({
      id,
      downloadFile,
      extension,
      mimetype,
      name,
    }): Function => (): Promise =>
      downloadFile({
        variables: { id },
      }).then(({ data }) => {
        const content: Object = get(data, 'downloadFile');

        if (!isEmpty(content)) {
          const a = document.createElement('a');
          const blob = new Blob([new Uint8Array(content.data)], {
            type: mimetype,
          });
          const url = window.URL.createObjectURL(blob);

          document.body.appendChild(a);

          a.download = `${name}.${extension}`;
          a.href = url;
          a.style.display = 'none';

          a.click();
          a.remove();

          window.URL.revokeObjectURL(url);
        }
      }),
    handlePlayer: ({ id, mimetype, openModal }): Function => (): void =>
      openModal(MEDIA_CONTENT_MODAL_ID, { fileId: id, mimetype }),
    handleSubmit: ({ updateFile }) => ({ id, description, name }) =>
      updateFile({
        refetchQueries: [{ query: getFileList }],
        variables: { id, description, name },
      }),
  }),
)(MediaPreview);

export type { MediaPreviewValueType };
