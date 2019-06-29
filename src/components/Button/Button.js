import classNames from 'classnames';
import * as React from 'react';

// Style
import style from './Button.scss';

const COLOR = {
  ALERT: 'alert',
  DANGER: 'danger',
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
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
  className,
  color = COLOR.PRIMARY,
  disabled,
  fullWidth,
  icon,
  loading,
  size = SIZE.DEFAULT,
  type = 'button',
  variant = VARIANT.DEFAULT,
  ...props
}) => (
  // eslint-disable-next-line
  <button
    {...props}
    className={classNames(
      className,
      style.Root,
      {
        [style.RootColorAlert]: color === COLOR.ALERT,
        [style.RootColorDanger]: color === COLOR.DANGER,
        [style.RootColorPrimary]: color === COLOR.PRIMARY,
        [style.RootColorSecondary]: color === COLOR.SECONDARY,
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
      {
        [style.RootIsDisabled]: !!disabled,
        [style.RootIsFull]: !!fullWidth,
        [style.RootIsLoading]: !!loading,
        [style.RootIsOnlyIcon]: !children && !!icon,
      },
    )}
    disabled={disabled || loading}
    type={type}
  >
    {loading ? (
      <i className={classNames(style.Loading, 'far fa-spinner-third')} />
    ) : (
      <React.Fragment>
        {icon && <i className={classNames(style.Icon, icon)} />}
        {children}
      </React.Fragment>
    )}
  </button>
);

export default Button;
