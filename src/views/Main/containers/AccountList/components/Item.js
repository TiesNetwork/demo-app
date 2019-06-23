import classNames from 'classnames';
import * as React from 'react';
import { compose, withHandlers } from 'recompose';

// Components
import Button from '@components/Button';

// Style
import style from './Item.scss';

type MainAccountListItemPropTypes = {
  address: string,
  handleDelete: Function,
  handleClick: Function,
  name: string,
  selected: boolean,
};

const MainAccountListItem = ({
  address,
  handleClick,
  handleDelete,
  name,
  selected,
}: MainAccountListItemPropTypes): React.Element<'div'> => (
  <div
    className={classNames(style.Root, { [style.RootIsSelected]: !!selected })}
    onClick={handleClick}
    role="button"
    tabIndex={0}
  >
    <div className={style.Avatar}>
      <div className={style.Icon} />
    </div>

    <div className={style.Info}>
      <div className={style.Name}>
        {name}
      </div>

      <div className={style.Address}>
        {`0x${address}`}
      </div>
    </div>

    <div className={style.Actions}>
      <Button
        color="danger"
        icon="far fa-trash-alt"
        onClick={handleDelete}
        size="small"
        variant="outline"
      >
        Delete
      </Button>
    </div>
  </div>
);

export default compose(
  withHandlers({
    handleDelete: ({ address, onDelete }): Function => (
      event: SyntheticEvent,
    ): void => {
      event.stopPropagation();
      onDelete && onDelete(address);
    },
    handleClick: ({ address, onClick, selected }): Function =>
      !selected && onClick && onClick(address),
  }),
)(MainAccountListItem);

export type { MainAccountListItemPropTypes };
