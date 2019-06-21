import classNames from 'classnames';
import moment from 'moment';
import prettyBytes from 'pretty-bytes';
import * as React from 'react';
import { graphql } from 'react-apollo';
import { Field as ReduxField, reduxForm } from 'redux-form';
import { compose, withHandlers } from 'recompose';

// Components
import Field from '../components/Field';

// GraphQL
import deleteFile from '../graphql/deleteFile.graphql';
import getFileList from '../graphql/getFileList.graphql';
import updateFile from '../graphql/updateFile.graphql';

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
  createdAt,
  extension,
  handleDelete,
  handleSubmit,
  name,
  size,
  submit,
}: MediaPreviewPropsType): React.Element<'div'> => (
  <div className={style.Root}>
    <form onSubmit={handleSubmit}>
      <ReduxField
        className={style.Name}
        component="input"
        format={(value: string): string => value && `${value}.${extension}`}
        name="name"
        parse={(value: string): string =>
          value && value.substr(0, value.indexOf('.'))
        }
      />

      <div className={style.Preview}>
        <img
          alt="test"
          className={style.PreviewContent}
          src="https://images.unsplash.com/photo-1494548162494-384bba4ab999?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80"
        />
      </div>

      <div className={style.Info}>
        <Field label="Type" value={extension.toUpperCase()} />
        <Field label="Size" value={`${prettyBytes(size)} (${size} Bytes)`} />
        <Field
          label="Created date"
          value={moment(createdAt).format('MMM DD, YYYY')}
        />
        <Field label="Owner" value="me" />
      </div>

      <ReduxField
        className={style.Description}
        component="textarea"
        name="description"
        placeholder="Add description"
      />

      <div className={style.Actions}>
        <button
          className={classNames(style.Button, style.Delete)}
          onClick={handleDelete}
          type="button"
        >
          Delete
        </button>

        <button className={classNames(style.Button, style.Save)} type="submit">
          Save
        </button>
      </div>
    </form>
  </div>
);

export default compose(
  graphql(deleteFile, { name: 'deleteFile' }),
  graphql(updateFile, { name: 'updateFile' }),
  reduxForm({
    form: 'fileForm',
    // enableReinitialize: true,
    // onSubmit: (
    //   { id, description, name }: MediaPreviewValueType,
    //   dispatch: Function,
    //   { updateFile }: MediaPreviewPropsType,
    // ): void => console.log,
    // updateFile({
    //   refetchQueries: [{ query: getFileList }],
    //   variables: { id, description, name },
    // }),
  }),
  withHandlers({
    handleDelete: ({
      deleteFile,
      id,
    }: MediaPreviewPropsType): Function => (): Promise =>
      deleteFile({
        refetchQueries: [{ query: getFileList }],
        variables: { id },
      }),
  }),
)(MediaPreview);

export type { MediaPreviewValueType };
