import { get } from 'lodash';
import * as React from 'react';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { SubmissionError } from 'redux-form';

// Components
import Modal from '@components/Modal';

// Containers
import Form from './containers/Form';

// Ducks
import { MAIN_CONFIRM_MODAL_ID } from '@views/Main/ducks';

// GraphQL
import importAccount from '@views/Main/graphql/importAccount.graphql';

// Services
import { closeModal } from '@services/modals';
import { setSession } from '@services/session';

// Style
import style from './Confirm.scss';

const MainConfirm = ({ handleSubmit }) => (
  <Modal
    classNames={{ container: style.Root }}
    id={MAIN_CONFIRM_MODAL_ID}
    title="main.confirm.title"
  >
    {({ address }) => <Form address={address} onSubmit={handleSubmit} />}
  </Modal>
);

export default compose(
  graphql(importAccount, { name: 'importAccount' }),
  connect(
    null,
    { closeModal, setSession },
  ),
  withHandlers({
    handleSubmit: ({ closeModal, importAccount, setSession }): Function => ({
      json,
      password,
    }): void =>
      importAccount({ variables: { json, password } })
        .then(({ data }) => {
          const { address, privateKey } = get(data, 'importAccount');

          if (address && privateKey) {
            closeModal(MAIN_CONFIRM_MODAL_ID);
            setSession({ address, privateKey });
          }
        })
        .catch((error: Error) => {
          const errors = {};

          get(error, 'graphQLErrors', []).forEach(({ extensions, message }) => {
            const key = get(extensions, 'exception.key', '_error');
            errors[key] = message;
          });

          throw new SubmissionError(errors);
        }),
  }),
)(MainConfirm);
