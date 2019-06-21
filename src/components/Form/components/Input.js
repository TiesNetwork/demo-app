import * as React from 'react';

// Components
import { Field } from '@components/Form';

// Style
import style from './Input.scss';

const FormInput = ({ error, ...props }) => (
  <div className={style.Root}>
    <input className={style.Input} {...props} />
  </div>
);

export default props => (
  <Field {...props}>
    <FormInput />
  </Field>
);
