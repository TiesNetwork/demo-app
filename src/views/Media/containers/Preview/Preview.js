import moment from 'moment';
import prettyBytes from 'pretty-bytes';
import * as React from 'react';
import { graphql } from 'react-apollo';
import { compose, withHandlers } from 'recompose';

// Components
import Field from '@views/Media/components/Field';

// Containers
import Form from './containers/Form';

// GraphQL
import deleteFile from '@views/Media/graphql/deleteFile.graphql';
import getFileList from '@views/Media/graphql/getFileList.graphql';
import updateFile from '@views/Media/graphql/updateFile.graphql';

// Style
import style from './Preview.scss';

type MediaPreviewPropsType = {
  createdAt: Date,
  extension: string,
  handleSubmit: Function,
  name: string,
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
  extension,
  description,
  handleDelete,
  handleSubmit,
  name,
  size,
  submit,
}: MediaPreviewPropsType): React.Element<'div'> => (
  <div className={style.Root}>
    <div className={style.Header}>
      File Preview
      <button className={style.Close} type="button">
        <i className="fal fa-times" />
      </button>
    </div>

    {/* <div className={style.Preview}>
      <img
        alt="test"
        className={style.PreviewContent}
        src="https://images.unsplash.com/photo-1494548162494-384bba4ab999?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80"
      />
    </div> */}

    <div className={style.Info}>
      <Field label="Type" value={extension.toUpperCase()} />
      <Field label="Size" value={`${prettyBytes(size)} (${size} Bytes)`} />
      <Field
        label="Created date"
        value={moment(createdAt).format('MMM DD, YYYY')}
      />
      <Field label="Owner" value="me" />
    </div>

    <div className={style.Form}>
      <Form
        extension={extension}
        initialValues={{ id, description, name }}
        onDelete={handleDelete}
        onSubmit={handleSubmit}
      />
    </div>
  </div>
);

export default compose(
  graphql(deleteFile, { name: 'deleteFile' }),
  graphql(updateFile, { name: 'updateFile' }),
  withHandlers({
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
