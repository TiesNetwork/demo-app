import * as React from 'react';
import { reduxForm } from 'redux-form';
import { compose } from 'recompose';

// Components
import Button from '@components/Button';
import Form, { Input, Textarea } from '@components/Form';

// Style
import style from './Form.scss';

const MediaPreviewForm = ({
  extension,
  handleSubmit,
  onDelete,
  submitting,
}) => (
  <Form onSubmit={handleSubmit}>
    <Input
      format={(value: string): string => value && `${value}.${extension}`}
      label="Name"
      name="name"
      parse={(value: string): string =>
        value && value.substr(0, value.indexOf('.'))
      }
    />

    <Textarea label="Description" name="description" />

    <div className={style.Actions}>
      <Button
        color="danger"
        disabled={submitting}
        icon="fal fa-trash-alt"
        onClick={onDelete}
        variant="outline"
      >
        Delete
      </Button>

      <Button loading={submitting} type="submit">
        Save
      </Button>
    </div>
  </Form>
);

export default compose(
  reduxForm({
    form: 'fileForm',
    enableReinitialize: true,
  }),
)(MediaPreviewForm);
