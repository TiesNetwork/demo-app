import classNames from 'classnames';
import * as React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, withState } from 'recompose';

// Components
import Item from './components/Item';

// Services
import { getLocale, setLocale } from '@services/env';

// Style
import style from './Language.scss';

type MainLanguagePropTypes = {
  currentLocale: string,
  handleClick: Function,
  handleSelect: Function,
  isOpened: boolean,
};

const MainLanguage = ({
  currentLocale,
  handleClick,
  handleSelect,
  isOpened,
}: MainLanguagePropTypes): React.Element<'div'> => (
  <div
    className={classNames(style.Root, {
      [style.RootIsOpened]: !!isOpened,
    })}
    onClick={isOpened ? null : handleClick}
    role="button"
    tabIndex={0}
  >
    <div className={style.List}>
      <Item locale={currentLocale} selected />

      {['en', 'ru', 'fr', 'es', 'pt', 'ch']
        .filter(locale => locale !== currentLocale)
        .map(
          (locale: string, index: number): React.Element<typeof Item> => (
            <Item
              key={locale}
              disabled={index > 0}
              locale={locale}
              onClick={handleSelect}
            />
          ),
        )}
    </div>
  </div>
);

const mapStateToProps: Function = (state: Object): Object => ({
  currentLocale: getLocale(state),
});

export default compose(
  connect(
    mapStateToProps,
    { setLocale },
  ),
  withState('isOpened', 'setOpen', false),
  withHandlers({
    handleClick: ({ setOpen }): Function => (): void => setOpen(true),
    handleSelect: ({ setLocale, setOpen }): Function => (
      locale: string,
    ): void => {
      setLocale(locale);
      setOpen(false);
    },
  }),
)(MainLanguage);
