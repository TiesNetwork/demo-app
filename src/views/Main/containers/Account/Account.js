import * as React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';

// Ducks
import { MAIN_ACCOUNT_MODAL_ID } from '@views/Main/ducks';

// Servies
import { openModal } from '@services/modals';

// Style
import style from './Account.scss';

type MainAccountPropsType = {
  handleClick: Function,
  // openModal: Function,
};

const MainAccount = ({
  handleClick,
}: MainAccountPropsType): React.Element<'div'> => (
  <div className={style.Root}>
    <button
      className={style.Button} onClick={handleClick}
      type="button"
    >
      <i className="fas fa-wallet" />
      Auth By Wallet
    </button>
  </div>
);

export default compose(
  connect(
    null,
    { openModal },
  ),
  withHandlers({
    handleClick: ({ openModal }: MainAccountPropsType): Function => (): void =>
      openModal(MAIN_ACCOUNT_MODAL_ID),
  }),
)(MainAccount);
