import { object, string } from 'yup';

export default {
  Mutation: {
    importAccount: {
      validation: object().shape({
        json: string().required('Account JSON is required!'),
        password: string().required('Account password is required!'),
      }),
      resolve: async (root, { json, password }) => {
        console.log(123);
        return '123';
      },
    },
  },
};
