import { isEmpty } from 'lodash';

/**
 * @param {string} message
 */
export const required = (message: string = 'Field is required!') => (
  value: any,
): Object => ({
  message,
  isValid: !isEmpty(value),
});

export default (fields: Object) => (values: Object, props: Object): Object => {
  const errors = {};

  Object.keys(fields).forEach(
    (key: string): void => {
      [].concat(fields[key]).forEach(
        (validator: func): void => {
          const res = validator(values[key], props);

          if (res && !errors[key] && !res.isValid) {
            errors[key] = res.message || true;
          }
        },
      );
    },
  );

  return errors;
};
