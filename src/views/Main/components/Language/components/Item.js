import classNames from 'classnames';
import * as React from 'react';
import { compose, withHandlers } from 'recompose';

// Style
import style from './Item.scss';

type MainLanguageItemPropTypes = {
  disabled: boolean,
  handleClick: Function,
  locale: string,
  selected: boolean,
};

const MainLanguageItem = ({
  disabled,
  locale = '',
  handleClick,
  selected,
}: MainLanguageItemPropTypes) => (
  <div
    className={classNames(
      style.Root,
      {
        [style.RootVariantCh]: locale === 'ch',
        [style.RootVariantEn]: locale === 'en',
        [style.RootVariantEs]: locale === 'es',
        [style.RootVariantFr]: locale === 'fr',
        [style.RootVariantPt]: locale === 'pt',
        [style.RootVariantRu]: locale === 'ru',
      },
      {
        [style.RootIsDisabled]: !!disabled,
        [style.RootIsSelected]: !!selected,
      },
    )}
    onClick={handleClick}
    role="button"
    tabIndex={0}
  >
    <div className={style.Logo} />
  </div>
);

export default compose(
  withHandlers({
    handleClick: ({ locale, onClick }): Function => (): void =>
      onClick && onClick(locale),
  }),
)(MainLanguageItem);

export type { MainLanguageItemPropTypes };
