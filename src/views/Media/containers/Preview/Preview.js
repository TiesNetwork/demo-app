import moment from 'moment';
import prettyBytes from 'pretty-bytes';
import * as React from 'react';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';

// Components
import Field from '@views/Media/components/Field';
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
  isOwner,
  owner,
  handleClose,
  handleDelete,
  handleSubmit,
  name,
  size = 0,
}: MediaPreviewPropsType): React.Element<'div'> => (
  <div className={style.Root}>
    <div className={style.Header}>
      File Preview
      <button
        className={style.Close} onClick={handleClose}
        type="button"
      >
        <i className="fal fa-times" />
      </button>
    </div>
    {console.log()}
    <div className={style.Info}>
      <Field label="Type" value={extension.toUpperCase()} />
      <Field label="Size" value={`${prettyBytes(size)} (${size} Bytes)`} />
      <Field
        label="Created date"
        value={moment(createdAt).format('MMM DD, YYYY')}
      />
      <Field
        label="Owner"
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
)(MediaPreview);

export type { MediaPreviewValueType };
