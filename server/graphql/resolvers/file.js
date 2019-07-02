/* eslint-disable no-undef */
import { ApolloError } from 'apollo-server-express';
import imageThumbnail from 'image-thumbnail';
import { last } from 'lodash';
import filterAsync from 'node-filter-async';
import { Record } from 'tiesdb-client';
import uuid from 'uuid/v4';
import { object, string } from 'yup';

// Database
import DB from '../../database';

// Models
import File from '../../models/file';

export default {
  Query: {
    getFileContent: {
      validation: object().shape({
        id: string().required('ID is required!'),
      }),
      resolve: async (root, { id }) => {
        // Find the file in DB
        const records = await DB.recollect(
          `SELECT id, content FROM "filestorage"."files" WHERE id IN (${id})`,
        );
        // Check file
        if (!records || records.length === 0) {
          throw new ApolloError('error.file_not_exist', 'FILE_NOT_EXIST');
        }

        // Get file content
        const content = records[0].getValue('content');
        // Check content
        if (!content) {
          throw new ApolloError('error.file_not_found', 'FILE_NOT_FOUND');
        }

        return content;
      },
    },
    getFileList: async (root, { contains = '' }) => {
      const records: [Record] = await DB.recollect(
        'SELECT id, createdAt, description, extension, mimetype, name, size, thumbnail  FROM "filestorage"."files"',
      );

      const filteredRecords = contains.trim()
        ? await filterAsync(records, async record => {
          const id: string = record.getValue('id');
          const description: string = record.getValue('description') || '';
          const extension: string = record.getValue('extension') || '';
          const mimetype: string = record.getValue('mimetype') || '';
          const name: string = record.getValue('name') || '';

          let summary: string = (
            description +
              extension +
              name
          ).toLowerCase();

          if (mimetype === 'text/plain') {
            const records: [Record] = await DB.recollect(
              `SELECT id, content FROM "filestorage"."files" WHERE id IN (${id})`,
            );

            if (records && records.length > 0) {
              const content: Buffer = records[0].getValue('content');

              if (content) {
                summary += content.toString('utf8').toLowerCase();
              }
            }
          }

          return summary.indexOf(contains.toLowerCase()) > -1;
        })
        : records;

      return filteredRecords.map((record: Record): Object => {
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
          thumbnail: thumbnail ? thumbnail.toString('base64') : null,
        };
      });
    },
  },
  Mutation: {
    createFile: {
      resolve: async (root, { file }, { address, privateKey }) => {
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

          // Client mock
          return {
            ...newFile,
            createdAt: new Date().toISOString(),
            hasContent: !!content,
            owner: address,
            thumbnail: thumbnail.toString('base64'),
          };
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

        return { id };
      },
    },
    downloadFile: {
      validation: object().shape({
        id: string().required('ID is required!'),
      }),
      resolve: async (root, { id }) => {
        // Find the file in DB
        const records = await DB.recollect(
          `SELECT id, content FROM "filestorage"."files" WHERE id IN (${id})`,
        );
        // Check file
        if (!records || records.length === 0) {
          throw new ApolloError('error.file_not_exist', 'FILE_NOT_EXIST');
        }

        // Get file content
        const content = records[0].getValue('content');
        // Check content
        if (!content) {
          throw new ApolloError('error.file_not_found', 'FILE_NOT_FOUND');
        }

        return content;
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

        return { id, description, name };
      },
    },
  },
};
