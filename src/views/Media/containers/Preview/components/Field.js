import * as React from 'react';
import { FormattedMessage } from 'react-intl';

// Style
import style from './Field.scss';

const MediaField = ({
  children,
  label,
  value,
}: MediaFieldType): React.Element<'div'> => (
  <div className={style.Root}>
    <div className={style.Label}>
      <FormattedMessage defaultMessage={label} id={label} />
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
