import * as React from 'react';

// Components
import { Field } from '@components/Form';

// Style
import style from './Textarea.scss';

const FormTextarea = ({ error, ...props }) => (
  <div className={style.Root}>
    <textarea className={style.Textarea} {...props} />
  </div>
);

export default props => (
  <Field {...props}>
    <FormTextarea />
  </Field>
);
