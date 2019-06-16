import * as React from 'react';

// Components
import { Table } from '@views/Media';

const MediaList = ({ data }) =>
  data && data.length > 0 && <Table data={data} />;

export default MediaList;
