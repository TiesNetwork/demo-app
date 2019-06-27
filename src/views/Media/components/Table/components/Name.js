import classNames from 'classnames';
import { get } from 'lodash';
import * as React from 'react';

// Style
import style from './Name.scss';

// Utils
import { getFileIcon } from '@utils';

const MediaTableName = ({
  original,
}: MediaTableNameType): React.Element<'div'> => {
  const extension = get(original, 'extension');
  const mimetype = get(original, 'mimetype');
  const fileIcon = getFileIcon(mimetype);

  return (
    <div className={style.Root}>
      <div className={style.Icon}>
        <i
          className={classNames('fas', fileIcon, {
            [style.IconColorBlue]: ['fa-file-word'].indexOf(fileIcon) > -1,
            [style.IconColorGreen]:
              ['fa-file-excel', 'fa-file-image'].indexOf(fileIcon) > -1,
            [style.IconColorYellow]: ['fa-file-audio'].indexOf(fileIcon) > -1,
            [style.IconColorRed]:
              ['fa-file-pdf', 'fa-file-video'].indexOf(fileIcon) > -1,
          })}
        />
      </div>

      <div className={style.Name}>
        {`${get(original, 'name', 'untitled')}.${extension}`}
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
