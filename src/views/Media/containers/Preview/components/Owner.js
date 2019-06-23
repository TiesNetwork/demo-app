import classNames from 'classnames';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

// Style
import style from './Owner.scss';

const MediaPreviewOwner = ({ address = '', isOwner }) => (
  <div className={style.Root}>
    <i className={classNames(style.Icon, 'fas fa-user-circle')} />

    <div className={style.Address}>
      {isOwner ? (
        <FormattedMessage defaultMessage="me" id="media.preview.owner" />
      ) : (
        <a
          className={style.Link}
          href={`https://etherscan.io/address/${address}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          {`0x${address.substr(0, 16)}...`}
        </a>
      )}
    </div>
  </div>
);

export default MediaPreviewOwner;
