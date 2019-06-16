import * as React from 'react';

// Style
import style from './Field.scss';

const MediaField = ({
  children,
  label,
  value,
}: MediaFieldType): React.Element<'div'> => (
  <div className={style.Root}>
    <div className={style.Label}>
      {label}
    </div>

    <div className={style.Value}>
      {children || value}
    </div>
  </div>
);

export default MediaField;
export type MediaFieldType = {
  children: React.Node,
  label: string,
  value: React.Node,
};
