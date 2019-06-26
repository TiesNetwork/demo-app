import classNames from 'classnames';
import { get } from 'lodash';
import prettyBytes from 'pretty-bytes';
import * as React from 'react';
import { graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose, withState } from 'recompose';
import { reduxForm, SubmissionError } from 'redux-form';

// Components
import Button from '@components/Button';
import Form, { File } from '@components/Form';
import Modal from '@components/Modal';

// Ducks
import { MEDIA_UPLOAD_MODAL_ID } from '@views/Media/ducks';

// GraphQL
import createFile from '@views/Media/graphql/createFile.graphql';
import getFileList from '@views/Media/graphql/getFileList.graphql';

// Services
import { closeModal } from '@services/modals';

// Style
import style from './Upload.scss';

// Utils
import { getFileIcon } from '@utils';

type MediaUploadPropTypes = {
  error: string,
  file: {
    name: string,
    size: number,
    type: string,
  },
  handleSubmit: Function,
  reset: Function,
  submitting: boolean,
};

const MediaUpload = ({
  error,
  file: { name, size, type } = {},
  handleSubmit,
  reset,
  submitting,
}: MediaUploadPropTypes): React.Element<typeof Modal> => (
  <Modal id={MEDIA_UPLOAD_MODAL_ID}>
    <Form onSubmit={handleSubmit}>
      <div className={style.Root}>
        {!!error && (
          <div className={style.Error}>
            <FormattedMessage defaultMessage="Untitled error!" id={error} />
          </div>
        )}

        <div className={style.Logo}>
          <i
            className={classNames('fas', {
              [getFileIcon(type)]: !!name,
              'fa-cloud-upload': !name,
            })}
          />
        </div>

        <div className={style.Title}>
          {name || (
            <FormattedMessage
              defaultMessage="Drop file to upload"
              id="media.upload.title"
            />
          )}
        </div>

        {!!size && <div className={style.Size}>
          {prettyBytes(size)}
        </div>}

        {name ? (
          <div className={style.Actions}>
            <Button
              color="secondary"
              disabled={submitting}
              onClick={reset}
              variant="outline"
            >
              <FormattedMessage
                defaultMessage="Reset"
                id="media.upload.action.reset"
              />
            </Button>

            <Button
              icon="fas fa-cloud-upload"
              loading={submitting}
              type="submit"
            >
              <FormattedMessage
                defaultMessage="Upload"
                id="media.upload.action.submit"
              />
            </Button>
          </div>
        ) : (
          <div className={style.Browse}>
            <FormattedMessage
              defaultMessage="or {browse} your files"
              id="media.upload.description"
              values={{
                browse: (
                  // eslint-disable-next-line
                  <label className={style.Label} htmlFor="upload">
                    <FormattedMessage
                      defaultMessage="browse"
                      id="media.upload.browse"
                    />

                    <File
                      className={style.Input}
                      hidden
                      id="upload"
                      name="files"
                    />
                  </label>
                ),
              }}
            />
          </div>
        )}
      </div>
    </Form>
  </Modal>
);

export default compose(
  connect(
    null,
    { closeModal },
  ),
  graphql(createFile, { name: 'createFile' }),
  withState('customError', 'setCustomError'),
  withState('file', 'setFile'),
  reduxForm({
    form: 'uploadForm',
    onChange: ({ files }, dispatch, { setFile }): void =>
      setFile({
        name: get(files, '0.name'),
        size: get(files, '0.size', 0),
        type: get(files, '0.type'),
      }),
    onSubmit: (
      { files },
      dispatch,
      { closeModal, createFile, reset, setCustomError },
    ): void =>
      createFile({
        refetchQueries: [{ query: getFileList }],
        variables: { file: get(files, '0') },
      })
        .then(() => {
          closeModal(MEDIA_UPLOAD_MODAL_ID);
          reset();
        })
        .catch(({ graphQLErrors }) => {
          throw new SubmissionError({
            _error: get(graphQLErrors, '0.message'),
          });
        }),
  }),
)(MediaUpload);
