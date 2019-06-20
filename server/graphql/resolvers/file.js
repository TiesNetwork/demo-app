import { ApolloError } from 'apollo-server-express';
import { omit, set, values } from 'lodash';
import uuid from 'uuid/v5';
import { number, object, string } from 'yup';

let FILES = {
  'b188cfd0-f673-4e18-8fdb-b6243f003c49': {
    id: 'b188cfd0-f673-4e18-8fdb-b6243f003c49',
    createdAt: '2019-06-15T11:32:41.674Z',
    description: '123',
    extension: 'jpg',
    name: 'image',
    owner: '0xad9f6a020fa81297b9cb29c271e3816f27c9331f',
    size: 1621440,
    tags: [
      {
        id: '43a624fb-4ef6-48bb-8fc5-dee45518b7f7',
        color: 'DOWNY',
        title: 'Awesome ✌️',
      },
      {
        id: '43a624fb-4ef6-48bb-8fc5-dee45518b7f6',
        color: 'BLUE',
        title: 'Awesome ✌️',
      },
    ],
    updatedAt: '2019-06-15T11:40:21.344Z',
  },
  'b188cfd0-f673-4e18-8fdb-b6243f003c48': {
    id: 'b188cfd0-f673-4e18-8fdb-b6243f003c48',
    createdAt: '2019-06-16T11:32:41.674Z',
    extension: 'pdf',
    name: 'offer',
    owner: '0xad9f6a020fa81297b9cb29c271e3816f27c9331f',
    size: 5621440,
    tags: [
      {
        id: '43a624fb-4ef6-48bb-8fc5-dee45518b7f9',
        color: 'ORANGE',
        title: 'Employee',
      },
      {
        id: '43a624fb-4ef6-48bb-8fc5-dee45518b7f3',
        color: 'BLUE',
        title: 'Awesome ✌️',
      },
      {
        id: '43a624fb-4ef6-48bb-8fc5-dee45518b7f4',
        color: 'BLUE',
        title: 'Awesome ✌️',
      },
    ],
    updatedAt: '2019-06-15T11:40:21.344Z',
  },
};

export default {
  Query: {
    getFileList: () => values(FILES),
  },
  Mutation: {
    createFile: {
      validation: object().shape({
        extension: string()
          // eslint-disable-next-line
          .matches(/^(jpg|png|pdf)+$/, 'File extension is not correct!')
          .required('File name is required!'),
        name: string()
          // eslint-disable-next-line
          .matches(/^[A-я0-9-_]+$/, 'File name is not correct!')
          .required('File name is required!'),
        size: number()
          .lessThan(8388608, 'File size must be less than 8mb!')
          .required('File size is required!'),
      }),
      resolve: async (root, { extension, name, size }) => {
        // Generate UUID
        const id = uuid(name, uuid.URL);
        // Create new file
        const newFile = {
          id,
          extension,
          name,
          size,
          createdAt: new Date().toISOString(),
          description: '',
          tags: [],
          updatedAt: new Date().toISOString(),
        };
        // Update list
        set(FILES, `${id}`, newFile);
        // Return new file
        return newFile;
      },
    },
    deleteFile: {
      validation: object().shape({
        id: string().required('ID is required!'),
      }),
      resolve: async (root, { id }) => {
        if (!FILES[id]) {
          throw new ApolloError('File does not exist!');
        }

        // Delete file
        FILES = omit(FILES, id);

        return true;
      },
    },
    updateFile: {
      validation: object().shape({
        id: string().required('ID is required!'),
        name: string()
          // eslint-disable-next-line
          .matches(/^[A-z0-9]+$/, 'File name is not correct!')
          .required('File name is required!'),
      }),
      resolve: async (root, { id, description, name }) => {
        if (!id || !FILES[id]) {
          throw new ApolloError('File does not exist!');
        }

        // Update file
        description && set(FILES, `${id}.description`, description);
        name && set(FILES, `${id}.name`, name);

        return true;
      },
    },
  },
};
