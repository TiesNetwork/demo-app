import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { reduxForm } from 'redux-form';

// Components
import Button from '@components/Button';
import Form, { Input } from '@components/Form';

// Style
import style from './Search.scss';

const MediaSearch = ({ handleSubmit, submitting }) => (
  <Form className={style.Root} onSubmit={handleSubmit}>
    <div className={style.Group}>
      <FormattedMessage
        defaultMessage="Just start typing..."
        id="media.search.placeholder"
      >
        {placeholder => <Input name="search" placeholder={placeholder} />}
      </FormattedMessage>

      <Button
        className={style.Button} loading={submitting}
        type="submit"
      >
        <FormattedMessage defaultMessage="Search" id="media.search.action" />
      </Button>
    </div>
  </Form>
);

export default reduxForm({ form: 'search' })(MediaSearch);
