/* eslint-disable no-undef */
import { ApolloError } from 'apollo-server-express';
import imageThumbnail from 'image-thumbnail';
import { last } from 'lodash';
import { Record } from 'tiesdb-client';
import uuid from 'uuid/v4';
import { object, string } from 'yup';

// Database
import DB from '../../database';

// Models
import File from '../../models/file';

export default {
  Query: {
    getFileList: async (root, { contains = '' }) => {
      const records: [Record] = await DB.recollect(
        'SELECT id, content, createdAt, description, extension, mimetype, name, size, thumbnail  FROM "filestorage"."files"',
      );

      return records
        .filter((record: Record): boolean => {
          const content: Buffer = record.getValue('content');
          const description: string = record.getValue('description') || '';
          const extension: string = record.getValue('extension') || '';
          const mimetype: string = record.getValue('mimetype') || '';
          const name: string = record.getValue('name') || '';

          let summary: string = (description + extension + name).toLowerCase();

          if (content && mimetype === 'text/plain') {
            summary += content.toString('utf8').toLowerCase();
          }

          return summary.indexOf(contains) > -1;
        })
        .map((record: Record): Object => {
          const thumbnail = record.getValue('thumbnail');

          return {
            id: record.getValue('id'),
            createdAt: record.getValue('createdAt').toISOString(),
            description: record.getValue('description'),
            extension: record.getValue('extension'),
            mimetype: record.getValue('mimetype') || 'text/plain',
            name: record.getValue('name'),
            owner: record.signer.toString('hex').toLowerCase(),
            size: record.getValue('size'),
            test: record.getValue('content'),
            thumbnail: thumbnail ? thumbnail.toString('base64') : null,
          };
        });
    },
  },
  Mutation: {
    createFile: {
      resolve: async (root, { file }, { privateKey }) => {
        // Create a ties.db record
        const record: Record = new Record('filestorage', 'files');

        // Get file meta and read file
        const { createReadStream, filename, mimetype } = await file;
        const { content, size } = await new Promise((resolve, reject) => {
          // Body
          let buffer;
          // Create read stream
          const stream = createReadStream();

          // Build body from chunks
          stream.on('data', chunk => {
            buffer = !buffer
              ? Buffer.from(chunk)
              : Buffer.concat([buffer, chunk]);
          });

          // Handle end stream
          stream.on('end', () =>
            resolve({
              content: buffer,
              size: Buffer.byteLength(buffer),
            }),
          );
        });

        // Check file size
        if (size > 8388608) {
          throw new ApolloError('error.file_size_limit', 'FILE_SIZE_LIMIT');
        }

        // Create thumbnail
        let thumbnail = Buffer.from('');

        if (mimetype.split('/')[0] === 'image') {
          try {
            thumbnail = await imageThumbnail(content, {
              height: 576,
              width: 576,
            });
          } catch (error) {
            throw new ApolloError(
              'error.file_thubmnail_fail',
              'FILE_THUBMNAIL_FAIL',
            );
          }
        }

        // Generate id and file object
        const id = uuid();
        const splittedFilename = filename.split('.');
        const newFile = {
          id,
          mimetype,
          size,
          extension: last(splittedFilename),
          name: splittedFilename.slice(0, -1).join('.'),
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        try {
          // Update record
          record.putFields({ ...newFile, content, thumbnail }, File);
          // Push to DB
          await DB.modify([record], Buffer.from(privateKey, 'hex'));

          return newFile;
        } catch (error) {
          throw new ApolloError('error.file_save_error', 'FILE_SAVE_ERROR');
        }
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
        name: string().required('File name is required!'),
      }),
      resolve: async (root, { id, description, name }, { privateKey }) => {
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
