import { get } from 'lodash';
import moment from 'moment';
import prettyBytes from 'pretty-bytes';
import * as React from 'react';
import { connect } from 'react-redux';
import Table from 'react-table';

// Components
import Name from './components/Name';
import Tags from './components/Tags';

// Entities
import { setSelectedId } from '@views/Media/ducks/actions';

// Style
import 'react-table/react-table.css';
import style from './Table.scss';

type MediaTableType = {
  data: Array<Object>,
  setSelectedId: Function,
};

const COLUMNS = [
  {
    accessor: 'name',
    Cell: Name,
    Header: 'Media',
    sortable: false,
  },
  {
    accessor: 'tags',
    Cell: ({ value }) => value && value.length > 0 && <Tags value={value} />,
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

const MediaTable = ({
  data = [],
  setSelectedId,
}: MediaTableType): React.Element<'div'> => (
  <div className={style.Root}>
    <Table
      columns={COLUMNS}
      data={data}
      defaultPageSize={100000}
      getTrProps={(root, { original }): Function => ({
        onClick: () => setSelectedId(get(original, 'id')),
      })}
      minRows={0}
      resizable={false}
      showPagination={false}
    />
  </div>
);

export default connect(
  null,
  { setSelectedId },
)(MediaTable);

export type { MediaTableType };
