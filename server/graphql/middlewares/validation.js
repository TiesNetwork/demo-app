import { ApolloError } from 'apollo-server-express';

export default {
  async Mutation(resolve, root, args, context, info) {
    const field = info.schema.getMutationType().getFields()[info.fieldName];
    const schema = field.validation;

    if (schema) {
      try {
        // eslint-disable-next-line
        const values = await schema.validate(args);
      } catch (error) {
        throw new ApolloError(error.message, 'DATA_VALIDATION_ERROR', {
          key: error.path,
        });
      }
    }

    return resolve(root, args, context, info);
  },
};
