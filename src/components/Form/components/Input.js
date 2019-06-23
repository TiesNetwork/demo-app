import classNames from 'classnames';
import * as React from 'react';

// Components
import { Field } from '@components/Form';

// Style
import style from './Input.scss';

const FormInput = ({ error, info, ...props }) => (
  <div className={classNames(style.Root, { [style.RootIsErred]: !!error })}>
    <input className={style.Input} {...props} />
    {info && <div className={style.Info}>
      {info}
    </div>}
  </div>
);

export default props => (
  <Field {...props}>
    <FormInput />
  </Field>
);
