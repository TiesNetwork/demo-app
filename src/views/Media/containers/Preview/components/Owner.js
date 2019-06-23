import classNames from 'classnames';
import * as React from 'react';

// Style
import style from './Owner.scss';

const MediaPreviewOwner = ({ address, isOwner }) => (
  <div className={style.Root}>
    <i className={classNames(style.Icon, 'fas fa-user-circle')} />

    <div className={style.Address}>
      {isOwner ? (
        'me'
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
