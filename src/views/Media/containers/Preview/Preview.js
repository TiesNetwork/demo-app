import moment from 'moment';
import prettyBytes from 'pretty-bytes';
import * as React from 'react';
import { graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose, lifecycle, withHandlers } from 'recompose';

// Components
import Field from './components/Field';
import Owner from './components/Owner';

// Containers
import Form from './containers/Form';

// Ducks
import { setSelectedId } from '@views/Media/ducks';

// GraphQL
import deleteFile from '@views/Media/graphql/deleteFile.graphql';
import getFileList from '@views/Media/graphql/getFileList.graphql';
import updateFile from '@views/Media/graphql/updateFile.graphql';

// Services
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
  handleSubmit: Function,
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
  handleSubmit,
  isOwner,
  mimetype,
  name,
  owner,
  size = 0,
  test,
  thumbnail,
}: MediaPreviewPropsType): React.Element<'div'> => (
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

    {thumbnail && (
      <div className={style.Thumbnail}>
        <img
          alt={name}
          className={style.Image}
          src={`data:${mimetype};base64,${thumbnail}`}
        />
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

const mapStateToProps: Function = (
  state: Object,
  { owner }: MediaPreviewPropsType,
) => ({
  isOwner: isOwner(state, owner),
});

export default compose(
  connect(
    mapStateToProps,
    { setSelectedId },
  ),
  graphql(deleteFile, { name: 'deleteFile' }),
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
        variables: { id },
      }),
    handleSubmit: ({ updateFile }) => ({ id, description, name }) =>
      updateFile({
        refetchQueries: [{ query: getFileList }],
        variables: { id, description, name },
      }),
  }),
  lifecycle({
    componentDidMount() {
      const { extension, mimetype, name, test } = this.props;

      if (test) {
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.style.display = 'none';
        const blob = new Blob([new Uint8Array(test.data)], { type: mimetype });
        const url = window.URL.createObjectURL(blob);
        console.log(blob);
        a.href = url;
        a.download = `${name}.${extension}`;
        a.click();

        window.URL.revokeObjectURL(url);
      }
    },
  }),
)(MediaPreview);

export type { MediaPreviewValueType };
