import classNames from 'classnames';
import * as React from 'react';

// Style
import style from './Owner.scss';

const MediaPreviewOwner = ({ address, value }) => (
  <div className={style.Root}>
    <i className={classNames(style.Icon, 'fas fa-user-circle')} />

    <div className={style.Address}>
      <a
        className={style.Link}
        href={`https://etherscan.io/address/${value}`}
        rel="noopener noreferrer"
        target="_blank"
      >
        {`0x${value.substr(0, 16)}...`}
      </a>
    </div>
  </div>
);

export default MediaPreviewOwner;
