import { get } from 'lodash';
import * as React from 'react';
import { graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { reduxForm, SubmissionError } from 'redux-form';
import { compose } from 'recompose';

// Components
import Button from '@components/Button';
import Form, { Input } from '@components/Form';
import Modal from '@components/Modal';

import Json from './components/Json';

// Ducks
import {
  MAIN_IMPORT_ACCOUNT_FORM_ID,
  MAIN_IMPORT_ACCOUNT_MODAL_ID,
} from '@views/Main/ducks';

// Entities
import { createAccount } from '@entities/accounts';

// GraphQL
import importAccount from '@views/Main/graphql/importAccount.graphql';

// Utils
import { validate, required } from '@components/Form/utils';

// Services
import { closeModal } from '@services/modals';
import { setSession } from '@services/session';

// Style
import style from './Import.scss';

type MainImportPropTypes = {
  handleSubmit: Function,
};

const MainImport = ({
  handleSubmit,
  submitting,
}: MainImportPropTypes): React.Element<typeof Modal> => (
  <Modal
    classNames={{ container: style.Modal }}
    id={MAIN_IMPORT_ACCOUNT_MODAL_ID}
    title="main.import.title"
  >
    <Form onSubmit={handleSubmit}>
      <Input label="main.import.form.name" name="name" />
      <Input
        label="main.import.form.password"
        name="password"
        type="password"
      />

      <Json name="json" />

      <div className={style.Actions}>
        <Button loading={submitting} type="submit">
          <FormattedMessage
            defaultMessage="Import"
            id="main.import.action.submit"
          />
        </Button>
      </div>
    </Form>
  </Modal>
);

export default compose(
  connect(
    null,
    { closeModal, createAccount, setSession },
  ),
  graphql(importAccount, { name: 'importAccount' }),
  reduxForm({
    form: MAIN_IMPORT_ACCOUNT_FORM_ID,
    onSubmit: (
      variables,
      dispatch,
      { closeModal, createAccount, importAccount, setSession },
    ) =>
      importAccount({ variables })
        .then(({ data }) => {
          const { address, privateKey } = get(data, 'importAccount');
          const { json, name } = variables;

          if (address && privateKey) {
            createAccount(address, {
              address,
              json,
              name,
            });

            closeModal(MAIN_IMPORT_ACCOUNT_MODAL_ID);

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
    validate: validate({
      json: [required()],
      name: [required()],
      password: [required()],
    }),
  }),
)(MainImport);

export type { MainImportPropTypes };
