import classNames from 'classnames';
import * as React from 'react';

// Style
import style from './Button.scss';

const COLOR = {
  ALERT: 'alert',
  DANGER: 'danger',
  PRIMARY: 'primary',
  SUCCESS: 'success',
};

const SIZE = {
  DEFAULT: 'default',
  SMALL: 'small',
};

const VARIANT = {
  DEFAULT: 'default',
  OUTLINE: 'outline',
};

const Button = ({
  children,
  color = COLOR.PRIMARY,
  icon,
  size = SIZE.DEFAULT,
  type = 'button',
  variant = VARIANT.DEFAULT,
  ...props
}) => (
  // eslint-disable-next-line
  <button
    {...props}
    className={classNames(
      style.Root,
      {
        [style.RootColorAlert]: color === COLOR.ALERT,
        [style.RootColorDanger]: color === COLOR.DANGER,
        [style.RootColorPrimary]: color === COLOR.PRIMARY,
        [style.RootColorSuccess]: color === COLOR.SUCCESS,
      },
      {
        [style.RootSizeDefault]: size === SIZE.DEFAULT,
        [style.RootSizeSmall]: size === SIZE.SMALL,
      },
      {
        [style.RootVariantDefault]: variant === VARIANT.DEFAULT,
        [style.RootVariantOutline]: variant === VARIANT.OUTLINE,
      },
    )}
    type={type}
  >
    {icon && <i className={classNames(style.Icon, icon)} />}
    {children}
  </button>
);

export default Button;
