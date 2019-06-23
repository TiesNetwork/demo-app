import classNames from 'classnames';
import { get } from 'lodash';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { compose, withHandlers, withState } from 'recompose';

// Components
import { Field } from '@components/Form';

// Style
import style from './Json.scss';

const MainImportJson = ({ address, error, handleChange, name }) => (
  <label
    className={classNames(style.Root, {
      [style.RootIsErred]: !!error,
      [style.RootIsSucceeded]: !!address,
    })}
    htmlFor="json"
  >
    <div className={style.Logo}>
      <i className="fas fa-user-lock" />
    </div>

    <div className={style.Info}>
      <div className={style.Title}>
        <FormattedMessage
          defaultMessage={address ? 'Imported account' : 'Attach your JSON'}
          id={address ? 'main.import.json.imported' : 'main.import.json.title'}
        />
      </div>

      <div className={style.Description}>
        {address ? (
          `0x${address}`
        ) : (
          <FormattedMessage
            defaultMessage="Your private key is needed to sign database records."
            id="main.import.json.description"
          />
        )}
      </div>
    </div>

    <input
      className={style.Input}
      id="json"
      name={name}
      onChange={handleChange}
      type="file"
    />
  </label>
);

const ComposedMainImportJson = compose(
  withState('address', 'setAddress'),
  withHandlers({
    handleChange: ({ onChange, setAddress }): Function => (
      event: SyntheticEvent,
    ): void => {
      const file: File = get(event, 'target.files.0');

      if (file) {
        const reader: FileReader = new FileReader();

        reader.onload = () => {
          try {
            const json = JSON.parse(get(reader, 'result'));
            const address = get(json, 'address');

            if (address) {
              setAddress(address);
              onChange && onChange(get(reader, 'result'));
            }
          } catch (e) {
            // eslint-disable-next-line
            console.error(e);
          }
        };

        reader.readAsText(file);
      }
    },
  }),
)(MainImportJson);

export default props => (
  <Field {...props}>
    <ComposedMainImportJson />
  </Field>
);
