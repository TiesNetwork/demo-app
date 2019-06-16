import classNames from 'classnames';
import { get } from 'lodash';
import * as React from 'react';

// Style
import style from './Tags.scss';

const COLOR = {
  BLACK: 'BLACK',
  BLUE: 'BLUE',
  DOWNY: 'DOWNY',
  ORANGE: 'ORANGE',
  PURPLE: 'PURPLE',
  RED: 'RED',
};

const MediaTableTags = ({
  value = [],
}: MediaTableTagsType): React.Element<div> => {
  const { color, title } = get(value, '0');
  const extraLength: number = value.length - 1;

  return title ? (
    <div
      className={classNames(style.Root, {
        [style.RootColorBlack]: color === COLOR.BLACK,
        [style.RootColorBlue]: color === COLOR.BLUE,
        [style.RootColorDowny]: color === COLOR.DOWNY,
        [style.RootColorOrange]: color === COLOR.ORANGE,
        [style.RootColorPurple]: color === COLOR.PURPLE,
        [style.RootColorRed]: color === COLOR.RED,
      })}
    >
      <div className={style.Tag}>
        <div className={style.Color} />
        <div className={style.Title}>
          {title}
        </div>
      </div>

      {!!extraLength && (
        <div className={style.More}>
          {`+${extraLength} more`}
        </div>
      )}
    </div>
  ) : null;
};

export default MediaTableTags;
export type MediaTableTagsType = {
  value: Array<Object>,
};
