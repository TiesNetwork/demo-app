import * as React from 'react';
import { FormattedMessage } from 'react-intl';

// Style
import style from './Header.scss';

const MediaHeader = ({ count }: MediaHeaderType): React.Element<'div'> => (
  <div className={style.Root}>
    <div className={style.Left}>
      <div className={style.Title}>
        <FormattedMessage defaultMessage="Media Library" id="media.title" />
      </div>

      {!!count && (
        <div className={style.Count}>
          <FormattedMessage defaultMessage="media items" id="media.count">
            {message => `(${count} ${message})`}
          </FormattedMessage>
        </div>
      )}
    </div>
  </div>
);

export default MediaHeader;
export type MediaHeaderType = {
  count: number,
};
