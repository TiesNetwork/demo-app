import * as React from 'react';

// Components
import Modal from '@components/Modal';

// Ducks
import { MEDIA_UPLOAD_MODAL_ID } from '@views/Media/ducks';

const MediaUpload = () => (
  <Modal id={MEDIA_UPLOAD_MODAL_ID} title="Upload file">
    <div>123</div>
  </Modal>
);

export default MediaUpload;
