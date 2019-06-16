import moment from 'moment';
import prettyBytes from 'pretty-bytes';
import * as React from 'react';
import Table from 'react-table';

// Components
import Name from './components/Name';
import Tags from './components/Tags';

// Style
import 'react-table/react-table.css';
import style from './Table.scss';

const COLUMNS = [
  {
    accessor: 'name',
    Cell: Name,
    Header: 'Media',
    sortable: false,
  },
  {
    accessor: 'tags',
    Cell: Tags,
    Header: 'Labels',
    sortable: false,
  },
  {
    accessor: 'createdAt',
    Cell: ({ value }) => moment(value).format('MMM DD, YYYY'),
    Header: 'Upload Date',
    sortable: false,
    width: 140,
  },
  {
    accessor: 'size',
    Cell: ({ value }) => prettyBytes(value),
    Header: 'Size',
    sortable: false,
    width: 120,
  },
];

const MediaTable = ({ data = [] }) => (
  <div className={style.Root}>
    <Table
      columns={COLUMNS}
      data={data}
      defaultPageSize={100000}
      minRows={0}
      resizable={false}
      showPagination={false}
    />
  </div>
);

export default MediaTable;
export type MediaTableType = {
  data: Array<Object>,
};