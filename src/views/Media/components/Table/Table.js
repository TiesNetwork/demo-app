import classNames from 'classnames';
import { get } from 'lodash';
import moment from 'moment';
import prettyBytes from 'pretty-bytes';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import Table from 'react-table';

// Components
import Name from './components/Name';

// Entities
import { getSelectedId, setSelectedId } from '@views/Media/ducks';

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
    accessor: 'description',
    Cell: ({ value }) => value,
    Header: (
      <FormattedMessage
        defaultMessage="Description"
        id="media.table.header.description"
      />
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
  selectedId,
  setSelectedId,
}: MediaTableType): React.Element<'div'> => (
  <div className={style.Root}>
    <Table
      columns={COLUMNS}
      data={data}
      defaultPageSize={100000}
      getTrProps={(root, { original }): Function => ({
        className: classNames(style.Row, {
          [style.RowIsSelected]: get(original, 'id') === selectedId,
        }),
        onClick: () => setSelectedId(get(original, 'id')),
      })}
      minRows={0}
      resizable={false}
      showPagination={false}
    />
  </div>
);

const mapStateToProps: Function = (state: Object) => ({
  selectedId: getSelectedId(state),
});

export default connect(
  mapStateToProps,
  { setSelectedId },
)(MediaTable);

export type { MediaTableType };
