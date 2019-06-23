import { ApolloError } from 'apollo-server-express';
import { get } from 'lodash';
import nodeEth from 'node-eth-address';
import { object, string } from 'yup';

export default {
  Mutation: {
    importAccount: {
      validation: object().shape({
        json: string().required('Account JSON is required!'),
        password: string().required('Account password is required!'),
      }),
      resolve: async (root, { json, password }): string => {
        try {
          const parsedJson = JSON.parse(json);

          const address = get(parsedJson, 'address').toLowerCase();
          const privateKey = nodeEth.recoverPrivateKey(password, parsedJson);

          return { address, privateKey };
        } catch (e) {
          throw new ApolloError('Password not match!', 'INVALID_PASSWORD', {
            key: 'password',
          });
        }
      },
    },
  },
};
