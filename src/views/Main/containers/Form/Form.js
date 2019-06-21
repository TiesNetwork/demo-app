import * as React from 'react';
import { graphql } from 'react-apollo';
import { compose } from 'recompose';
import { reduxForm } from 'redux-form';

// Components
import Form, { Input } from '@components/Form';
import Private from './components/Private';

// Ducks
import { MAIN_ACCOUNT_FORM_ID } from '@views/Main/ducks';

// GraphQL
import importAccount from '@views/Main/graphql/importAccount.graphql';

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
  graphql(importAccount, { name: 'importAccount' }),
  reduxForm({
    form: MAIN_ACCOUNT_FORM_ID,
    onSubmit: console.log,
    validate: validate({
      json: [required()],
      name: [required()],
      password: [required()],
    }),
  }),
)(MainForm);
