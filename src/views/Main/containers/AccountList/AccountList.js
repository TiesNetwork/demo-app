import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';

// Components
import Button from '@components/Button';
import Modal from '@components/Modal';

import Item from './components/Item';

// Ducks
import {
  MAIN_ACCOUNT_LIST_MODAL_ID,
  MAIN_CONFIRM_MODAL_ID,
  MAIN_IMPORT_ACCOUNT_MODAL_ID,
} from '@views/Main/ducks';

// Entities
import { deleteAccount, getAccountList } from '@entities/accounts';

// Services
import { openModal } from '@services/modals';
import { getSession, setSession } from '@services/session';

// Style
import style from './AccountList.scss';

type MainAccountListPropTypes = {
  accounts: Array<Object>,
  handleDelete: Function,
  handleImport: Function,
  handleSelect: Function,
  session: {
    address: string,
  },
};

const MainAccountList = ({
  accounts,
  handleDelete,
  handleImport,
  handleSelect,
  session,
}: MainAccountListPropTypes): React.Element<typeof Modal> => (
  <Modal
    classNames={{ container: style.Root }}
    id={MAIN_ACCOUNT_LIST_MODAL_ID}
    title="main.accountList.title"
  >
    <div className={style.List}>
      {accounts &&
        accounts.length > 0 &&
        accounts.map(({ address, name }) => (
          <Item
            key={address}
            address={address}
            name={name}
            onClick={handleSelect}
            onDelete={handleDelete}
            selected={address === session.address}
          />
        ))}
    </div>

    <div className={style.Actions}>
      <Button icon="far fa-plus" onClick={handleImport}>
        <FormattedMessage
          defaultMessage="Import new account"
          id="main.accountList.action.import"
        />
      </Button>
    </div>
  </Modal>
);

const mapStateToProps = (state: Object) => ({
  accounts: getAccountList(state),
  session: getSession(state),
});

export default compose(
  connect(
    mapStateToProps,
    { deleteAccount, openModal, setSession },
  ),
  withHandlers({
    handleDelete: ({ deleteAccount, session }): Function => (
      address: string,
    ): void => {
      address === session.address && setSession({});
      deleteAccount(address);
    },
    handleImport: ({ openModal }): Function => (): void =>
      openModal(MAIN_IMPORT_ACCOUNT_MODAL_ID),
    handleSelect: ({ openModal }): Function => (address: string): void =>
      openModal(MAIN_CONFIRM_MODAL_ID, { address }),
  }),
)(MainAccountList);
