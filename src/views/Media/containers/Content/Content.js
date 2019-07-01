import * as React from 'react';

// Components
import Modal from '@components/Modal';

// Containers
import Player from './containers/Player';

// Ducks
import { MEDIA_CONTENT_MODAL_ID } from '@views/Media/ducks';

// Style
import style from './Content.scss';

const MediaContent = (): React.Element<typeof Modal> => (
  <Modal classNames={{ container: style.Root }} id={MEDIA_CONTENT_MODAL_ID}>
    {({ fileId, mimetype }) =>
      fileId && <Player id={fileId} mimetype={mimetype} />
    }
  </Modal>
);

export default MediaContent;
