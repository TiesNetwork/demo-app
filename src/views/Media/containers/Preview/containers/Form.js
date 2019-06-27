import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { reduxForm } from 'redux-form';
import { compose } from 'recompose';

// Components
import Button from '@components/Button';
import Form, { Input, Textarea } from '@components/Form';

// Style
import style from './Form.scss';

// Utils
import { validate, required } from '@components/Form/utils';

const MediaPreviewForm = ({
  extension,
  handleSubmit,
  onDelete,
  submitting,
}) => (
  <Form onSubmit={handleSubmit}>
    <Input
      info="Разрешены буквы английского алфавита, цифры, тире и подчёркивание"
      label="media.preview.form.name"
      name="name"
    />

    <Textarea label="media.preview.form.description" name="description" />

    <div className={style.Actions}>
      <Button
        color="danger"
        disabled={submitting}
        icon="fal fa-trash-alt"
        onClick={onDelete}
        variant="outline"
      >
        <FormattedMessage
          defaultMessage="Delete"
          id="media.preview.form.action.delete"
        />
      </Button>

      <Button loading={submitting} type="submit">
        <FormattedMessage
          defaultMessage="Save"
          id="media.preview.form.action.submit"
        />
      </Button>
    </div>
  </Form>
);

export default compose(
  reduxForm({
    form: 'fileForm',
    // enableReinitialize: true,
    validate: validate({
      name: [required('error.required')],
    }),
  }),
)(MediaPreviewForm);
