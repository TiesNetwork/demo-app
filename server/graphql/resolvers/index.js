import { merge } from 'lodash';

// Resolvers
import account from './account';
import file from './file';

export default merge({}, account, file);
