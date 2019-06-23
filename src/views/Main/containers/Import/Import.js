import * as React from 'react';
import { reduxForm } from 'redux-form';

// Components
import Button from '@components/Button';
import Form, { Input } from '@components/Form';
import Modal from '@components/Modal';

import Json from './components/Json';

// Utils
import { validate, required } from '@components/Form/utils';

// Ducks
import {
  MAIN_IMPORT_ACCOUNT_FORM_ID,
  MAIN_IMPORT_ACCOUNT_MODAL_ID,
} from '@views/Main/ducks';

// Style
import style from './Import.scss';

type MainImportPropTypes = {
  handleSubmit: Function,
};

const MainImport = ({
  handleSubmit,
}: MainImportPropTypes): React.Element<typeof Modal> => (
  <Modal
    classNames={{ container: style.Modal }}
    id={MAIN_IMPORT_ACCOUNT_MODAL_ID}
    title="Import account"
  >
    <Form onSubmit={handleSubmit}>
      <Input label="Account name" name="name" />
      <Input
        label="Password" name="password"
        type="password"
      />

      <Json name="json" />

      <div className={style.Actions}>
        <Button type="submit">Import</Button>
      </div>
    </Form>
  </Modal>
);

export default reduxForm({
  form: MAIN_IMPORT_ACCOUNT_FORM_ID,
  onSubmit: console.log,
  validate: validate({
    json: [required()],
    name: [required()],
    password: [required()],
  }),
})(MainImport);

export type { MainImportPropTypes };
