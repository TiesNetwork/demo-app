import { ApolloError } from 'apollo-server-express';
import { omit, set } from 'lodash';
import { Record } from 'tiesdb-client';
import uuid from 'uuid/v4';
import { number, object, string } from 'yup';

// Database
import DB from '../../database';

// Models
import File from '../../models/file';

export default {
  Query: {
    getFileList: async (...args) => {
      const records = await DB.recollect(
        'SELECT id, createdAt, extension, name, size  FROM "filestorage"."files"',
      );
      // console.log(args);
      return records.map(record => ({
        id: record.getValue('id'),
        createdAt: record.getValue('createdAt').toISOString(),
        extension: record.getValue('extension'),
        name: record.getValue('name'),
        owner: record.signer.toString('hex').toLowerCase(),
        size: record.getValue('size'),
      }));
    },
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
      resolve: async (root, { extension, name, size }, { privateKey }) => {
        // Create a ties.db record
        const record = new Record('filestorage', 'files');

        // Generate id and file object
        const id = uuid();
        const newFile = {
          id,
          extension,
          size,
          name,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // Update record
        record.putFields(newFile, File);
        // Push to DB
        await DB.modify([record], Buffer.from(privateKey, 'hex'));

        return newFile;
      },
    },
    deleteFile: {
      validation: object().shape({
        id: string().required('ID is required!'),
      }),
      resolve: async (root, { id }, { privateKey }) => {
        // Find the file in DB
        const records = await DB.recollect(
          `SELECT id FROM "filestorage"."files" WHERE id IN (${id})`,
        );

        // Throw error if file not exist
        if (!records || records.length === 0) {
          throw new ApolloError('File does not exist!', 'FILE_NOT_EXIST');
        }

        // Mark record as delete
        records[0].delete(['id']);

        // Push to DB
        await DB.modify(records, Buffer.from(privateKey, 'hex'));

        return true;
      },
    },
    updateFile: {
      validation: object().shape({
        id: string().required('ID is required!'),
        name: string()
          // eslint-disable-next-line
          .matches(/^[A-z0-9-_]+$/, 'File name is not correct!')
          .required('File name is required!'),
      }),
      resolve: async (root, { id, description, name }, { privateKey }) => {
        console.log(privateKey);
        // Find the file in DB
        const records = await DB.recollect(
          `SELECT id, description, name FROM "filestorage"."files" WHERE id IN (${id})`,
        );

        if (!records || records.length === 0) {
          throw new ApolloError('File does not exist!', 'FILE_NOT_EXIST');
        }

        // Update description & name
        description &&
          records[0].putValue('description', description, File.description);
        name && records[0].putValue('name', name, File.name);

        // Push to DB
        await DB.modify(records, Buffer.from(privateKey, 'hex'));

        return true;
      },
    },
  },
};
