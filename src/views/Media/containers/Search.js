import classNames from 'classnames';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { reduxForm } from 'redux-form';

// Components
import Button from '@components/Button';
import Form, { Input } from '@components/Form';

// Style
import style from './Search.scss';

const MediaSearch = ({
  handleSubmit,
  initialValues: { search },
  onReset,
  submitting,
}) => (
  <Form
    className={classNames(style.Root, { [style.RootWithValue]: !!search })}
    onSubmit={handleSubmit}
  >
    <div className={style.Group}>
      <button
        className={style.Back} onClick={onReset}
        type="button"
      >
        <i className="far fa-long-arrow-left" />
      </button>

      <div>
        <FormattedMessage
          defaultMessage="Just start typing..."
          id="media.search.placeholder"
        >
          {placeholder => (
            <Input
              name="search" placeholder={placeholder}
              type="search"
            />
          )}
        </FormattedMessage>
      </div>

      <Button
        className={style.Button} loading={submitting}
        type="submit"
      >
        <FormattedMessage defaultMessage="Search" id="media.search.action" />
      </Button>
    </div>
  </Form>
);

export default reduxForm({ form: 'search', enableReinitialize: true })(
  MediaSearch,
);
