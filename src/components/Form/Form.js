import PropTypes from 'prop-types';
import * as React from 'react';

// Style
import style from './Form.scss';

type FormPropTypes = {
  children: React.Node,
  className: string,
  error: string,
  onSubmit: Function,
};

const Form = ({
  children,
  className,
  error,
  onSubmit,
}: FormPropTypes): React.Element<'form'> => (
  <form className={className} onSubmit={onSubmit}>
    <div className={style.Container}>
      {children}
    </div>
  </form>
);

export default Form;
export type { FormPropTypes };
