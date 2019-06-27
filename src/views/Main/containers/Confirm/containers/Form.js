import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { compose } from 'recompose';

// Components
import Button from '@components/Button';
import Form, { Input } from '@components/Form';

// Ducks
import { MAIN_CONFIRM_FORM_ID } from '@views/Main/ducks';

// Entities
import { getAccountByAddress } from '@entities/accounts';

// Style
import style from './Form.scss';

// Utils
import { validate, required } from '@components/Form/utils';

const MainConfirm = ({ handleSubmit, submitting }) => (
  <Form onSubmit={handleSubmit}>
    <Input
      label="main.confirm.form.password" name="password"
      type="password"
    />

    <div className={style.Actions}>
      <Button
        icon="fas fa-check" loading={submitting}
        type="submit"
      >
        <FormattedMessage
          defaultMessage="Confirm account"
          id="main.confirm.action.submit"
        />
      </Button>
    </div>
  </Form>
);

const mapStateToProps: Function = (state: Object, { address }): Object => ({
  initialValues: getAccountByAddress(state, address),
});

export default compose(
  connect(
    mapStateToProps,
    null,
  ),
  reduxForm({
    form: MAIN_CONFIRM_FORM_ID,
    validate: validate({
      password: [required('error.required')],
    }),
  }),
)(MainConfirm);
