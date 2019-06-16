import { get } from 'lodash';
import * as React from 'react';
import { Query } from 'react-apollo';

// Containers
import Header from './containers/Header';
import List from './containers/List';
import Preview from './containers/Preview';

// GraphQL
import getFileList from './graphql/getFileList.graphql';

// Style
import style from './Media.scss';

// Utils
import deepClear from '@utils/deepClear';

const Media = (): React.Element<typeof Query> => (
  <Query query={getFileList}>
    {({ data, error, loading }) => {
      const list: Array<> = deepClear(get(data, 'getFileList', []), [
        '__typename',
      ]);

      return (
        <div className={style.Root}>
          <div className={style.Container}>
            <div className={style.Header}>
              <Header count={list.length} />
            </div>

            <div className={style.List}>
              <List data={list} />
            </div>
          </div>

          {list && list.length > 0 && (
            <div className={style.Sidebar}>
              <Preview {...list[0]} />
            </div>
          )}
        </div>
      );
    }}
  </Query>
);

export default Media;
