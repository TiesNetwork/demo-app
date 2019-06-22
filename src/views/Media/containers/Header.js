import * as React from 'react';

// Style
import style from './Header.scss';

const MediaHeader = ({ count }: MediaHeaderType): React.Element<'div'> => (
  <div className={style.Root}>
    <div className={style.Left}>
      <div className={style.Title}>Media Library</div>

      {!!count && (
        <div className={style.Count}>
          {`(${count} media item${count > 1 ? 's' : ''})`}
        </div>
      )}
    </div>
  </div>
);

export default MediaHeader;
export type MediaHeaderType = {
  count: number,
};
