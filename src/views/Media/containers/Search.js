import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { reduxForm } from 'redux-form';

// Components
import Form, { Input } from '@components/Form';

const MediaSearch = () => (
  <Form>
    <FormattedMessage defaultMessage="Search" id="media.search">
      {placeholder => <Input name="search" placeholder={placeholder} />}
    </FormattedMessage>
  </Form>
);

export default reduxForm({ form: 'search' })(MediaSearch);
