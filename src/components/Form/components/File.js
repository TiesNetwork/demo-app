import * as React from 'react';

// Components
import { Field } from '@components/Form';

const FormFile = ({ id, name, onChange }) => (
  <input
    id={id} name={name}
    onChange={onChange} type="file"
  />
);

export default props => (
  <Field {...props}>
    <FormFile />
  </Field>
);
