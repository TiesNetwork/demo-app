import classNames from 'classnames';
import { get } from 'lodash';
import * as React from 'react';
import { compose, withHandlers, withState } from 'recompose';

// Components
import { Field } from '@components/Form';

// Style
import style from './Private.scss';

type MainFormPrivatePropTypes = {
  address: string,
  id: number,
  handleChange: Function,
  name: string,
};

const MainFormPrivate = ({
  address,
  id,
  error,
  handleChange,
  name,
  ...props
}: MainFormPrivatePropTypes) => (
  <label
    className={classNames(style.Root, {
      [style.RootIsErred]: !!error,
    })}
    htmlFor={id}
  >
    <div className={style.Logo}>
      <i className="fas fa-user-lock" />
    </div>

    <div className={style.Info}>
      <div className={style.Title}>
        {address ? 'Imported account' : 'Attach your JSON'}
      </div>

      <div className={style.Description}>
        {address
          ? `0x${address}`
          : 'Your private key is needed to sign database records.'}
      </div>
    </div>

    <input
      className={style.Input}
      id={id}
      name={name}
      onChange={handleChange}
      type="file"
    />
  </label>
);

const ComposedMainFormPrivate = compose(
  withState('address', 'setAddress', false),
  withHandlers({
    handleChange: ({ onChange, setAddress }: MainFormPrivatePropTypes) => (
      event: SyntheticEvent,
    ): void => {
      const file = get(event, 'target.files.0');

      if (file) {
        const reader = new FileReader();

        reader.onload = () => {
          try {
            const json = JSON.parse(get(reader, 'result'));
            setAddress(get(json, 'address'));

            onChange && onChange(JSON.stringify(json));
          } catch (e) {
            // eslint-disable-next-line
            console.error(e);
          }
        };

        reader.readAsText(file);
      }
    },
  }),
)(MainFormPrivate);

export default props => (
  <Field {...props}>
    <ComposedMainFormPrivate />
  </Field>
);
