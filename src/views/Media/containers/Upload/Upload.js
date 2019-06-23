import { get, last } from 'lodash';
import * as React from 'react';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';

// Components
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

type MediaUploadPropTypes = {
  handleChange: Function,
};

const MediaUpload = ({
  handleChange,
}: MediaUploadPropTypes): React.Element<typeof Modal> => (
  <Modal id={MEDIA_UPLOAD_MODAL_ID}>
    <div className={style.Root}>
      <div className={style.Logo}>
        <i className="fas fa-cloud-upload" />
      </div>

      <div className={style.Title}>Drop file to upload</div>

      <div className={style.Browse}>
        {`or `}
        <label className={style.Label} htmlFor="upload">
          browse
          <input
            className={style.Input}
            id="upload"
            onChange={handleChange}
            type="file"
          />
        </label>
        {' your files'}
      </div>
    </div>
  </Modal>
);

export default compose(
  connect(
    null,
    { closeModal },
  ),
  graphql(createFile, { name: 'createFile' }),
  withHandlers({
    handleChange: ({ closeModal, createFile }): Function => (
      event: FileList | SyntheticEvent,
    ) => {
      const file: File = Array.isArray(event)
        ? get(event, '0', {})
        : get(event, 'target.files.0', {});

      if (file) {
        const splittedFileName = file.name.split('.');

        createFile({
          refetchQueries: [{ query: getFileList }],
          variables: {
            extension: last(splittedFileName),
            name: splittedFileName.slice(0, -1).join('.'),
            size: file.size,
          },
        });

        closeModal(MEDIA_UPLOAD_MODAL_ID);
      }
    },
  }),
)(MediaUpload);

// <Dropzone onDrop={handleLoad}>
//   {({ getInputProps, getRootProps, isDragActive }) => (
//  <CSSTransition
//                 classNames={{
//                   enter: style.DragAnimateEnter,
//                   enterActive: style.DragAnimateEnterActive,
//                   exit: style.DragAnimateExit,
//                   exitActive: style.DragAnimateExitActive,
//                 }}
//                 in={isDragActive}
//                 timeout={400}
//                 unmountOnExit
//               >
//                 <div className={style.Drag}>
//                   <div className={style.DragContent}>
//                     <div className={style.DragIcon}>
//                       <i className="fas fa-cloud-upload" />
//                     </div>

//                     <div className={style.DragTitle}>
//                       {`Drag and drop, or `}
//                       <label className={style.DragLabel} htmlFor="file">
//                         browse
//                         <input {...getInputProps()} id="file" />
//                       </label>
//                       {' files!'}
//                     </div>
//                   </div>
//                 </div>
//               </CSSTransition>
