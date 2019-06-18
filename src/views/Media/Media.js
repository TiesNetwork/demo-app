import { get } from 'lodash';
import * as React from 'react';
import { Query } from 'react-apollo';
import { connect } from 'react-redux';
import { compose } from 'recompose';

// Containers
import Header from './containers/Header';
import List from './containers/List';
import Preview from './containers/Preview';

// Ducks
import { getSelectedId } from './ducks';

// GraphQL
import getFileList from './graphql/getFileList.graphql';

// Style
import style from './Media.scss';

// Utils
import deepClear from '@utils/deepClear';

type MediaType = {
  selectedId: string,
};

const Media = ({ selectedId }: MediaType): React.Element<typeof Query> => (
  <Query query={getFileList}>
    {({ data, error, loading }) => {
      const list: Array<> = deepClear(get(data, 'getFileList', []), [
        '__typename',
      ]);

      const preview: Object =
        selectedId && list.find(({ id }): boolean => id === selectedId);

      return (
        <div className={style.Root}>
          <div className={style.Container}>
            <div className={style.Header}>
              <Header count={list.length} />
            </div>

            {list && list.length > 0 && (
              <div className={style.List}>
                <List data={list} />
              </div>
            )}
          </div>

          {selectedId && preview && (
            <div className={style.Sidebar}>
              <Preview {...preview} initialValues={preview} />
            </div>
          )}
        </div>
      );
    }}
  </Query>
);

const mapStateToProps: Function = (state: Object): Object => ({
  selectedId: getSelectedId(state),
});

export default compose(connect(mapStateToProps))(Media);
