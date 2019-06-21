import classNames from 'classnames';
import * as React from 'react';
import { Field } from 'redux-form';
import uuid from 'uuid/v5';

// Style
import style from './Field.scss';

// Utils
import { reduxFieldAdapter } from '@components/Form/utils';

type FormFieldPropTypes = {
  children: React.Node,
  label: string,
  name: string,
  type: string,
};

const FormField = (props: FormFieldPropTypes): React.Element<typeof Field> => {
  const { children, name } = props;
  const id = uuid(name, uuid.URL);

  return (
    <Field {...props} component={reduxFieldAdapter}>
      {({ error, label, ...props }) => (
        <div
          className={classNames(style.Root, {
            [style.RootIsErred]: !!error,
          })}
        >
          {label && (
            <div className={style.Header}>
              {label && (
                <label className={style.Label} htmlFor={id}>
                  {label}
                </label>
              )}

              {error && <div className={style.Error}>
                {` - ${error}`}
              </div>}
            </div>
          )}

          <div className={style.Control}>
            {typeof children === 'function'
              ? children({ ...props, id, label, error })
              : React.cloneElement(children, { ...props, id, label, error })}
          </div>
        </div>
      )}
    </Field>
  );
};

export default FormField;
