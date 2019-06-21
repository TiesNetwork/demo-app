import { get, set } from 'lodash';
import * as React from 'react';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { reduxForm, SubmissionError } from 'redux-form';

// Components
import Form, { Input } from '@components/Form';
import Private from './components/Private';

// Ducks
import { MAIN_ACCOUNT_FORM_ID } from '@views/Main/ducks';

// GraphQL
import importAccount from '@views/Main/graphql/importAccount.graphql';

// Services
import { setSession } from '@services/session';

// Style
import style from './Form.scss';

// Utils
import { validate, required } from '@components/Form/utils';

const MainForm = ({ handleSubmit }) => (
  <Form onSubmit={handleSubmit}>
    <Input label="Account name" name="name" />
    <Input
      label="Password" name="password"
      type="password"
    />

    <Private name="json" />

    <div className={style.Actions}>
      <button className={style.Button} type="submit">
        Join the Wallet
      </button>
    </div>
  </Form>
);

export default compose(
  connect(
    null,
    { setSession },
  ),
  graphql(importAccount, { name: 'importAccount' }),
  reduxForm({
    form: MAIN_ACCOUNT_FORM_ID,
    onSubmit: (variables, dispatch, { importAccount, setSession }) =>
      importAccount({ variables })
        .then(
          ({ data }): void =>
            setSession({
              address: get(data, 'importAccount.address'),
              name: get(variables, 'name'),
              privateKey: get(data, 'importAccount.privateKey'),
            }),
        )
        .catch((error: Error) => {
          const errors: Object = {};

          get(error, 'graphQLErrors', []).forEach(({ extensions, message }) => {
            const key = get(extensions, 'exception.key', '_error');
            set(errors, key, message);
          });

          throw new SubmissionError(errors);
        }),
    validate: validate({
      json: [required()],
      name: [required()],
      password: [required()],
    }),
  }),
)(MainForm);
