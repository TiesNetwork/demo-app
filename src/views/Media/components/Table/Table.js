import { get } from 'lodash';
import moment from 'moment';
import prettyBytes from 'pretty-bytes';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
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
    Header: (
      <FormattedMessage defaultMessage="Media" id="media.table.header.name" />
    ),
    sortable: false,
  },
  {
    accessor: 'tags',
    Cell: ({ value }) => value && value.length > 0 && <Tags value={value} />,
    Header: (
      <FormattedMessage defaultMessage="Labels" id="media.table.header.tags" />
    ),
    sortable: false,
  },
  {
    accessor: 'createdAt',
    Cell: ({ value }) => moment(value).format('MMM DD, YYYY'),
    Header: (
      <FormattedMessage
        defaultMessage="Upload Date"
        id="media.table.header.createdAt"
      />
    ),
    sortable: false,
    width: 140,
  },
  {
    accessor: 'size',
    Cell: ({ value }) => prettyBytes(value),
    Header: (
      <FormattedMessage defaultMessage="Size" id="media.table.header.size" />
    ),
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
