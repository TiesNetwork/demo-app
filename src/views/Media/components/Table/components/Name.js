import classNames from 'classnames';
import { get } from 'lodash';
import * as React from 'react';

// Style
import style from './Name.scss';

const VARIANT = {
  IMAGE: {
    className: style.RootVariantImage,
    icon: 'fas fa-file-image',
  },
  PDF: {
    className: style.RootVariantPdf,
    icon: 'fas fa-file-pdf',
  },
};

const MediaTableName = ({
  original,
}: MediaTableNameType): React.Element<'div'> => {
  const ext = get(original, 'extension', 'jpg');
  const variant = ext === 'pdf' ? VARIANT.PDF : VARIANT.IMAGE;

  return (
    <div className={classNames(style.Root, variant.className)}>
      <div className={style.Icon}>
        <i className={variant.icon} />
      </div>

      <div className={style.Name}>
        {`${get(original, 'name', 'untitled')}.${ext}`}
      </div>
    </div>
  );
};

export default MediaTableName;
export type MediaTableNameType = {
  original: {
    extension: string,
    name: string,
  },
};
