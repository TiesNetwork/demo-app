import { get, isEmpty } from 'lodash';
import * as React from 'react';
import { Query } from 'react-apollo';
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { compose, withHandlers, withState } from 'recompose';

// Containers
import Empty from './containers/Empty';
import Header from './containers/Header';
import List from './containers/List';
import Preview from './containers/Preview';
import Upload from './containers/Upload';

// Ducks
import { getSelectedId } from './ducks';

// GraphQL
import getFileList from './graphql/getFileList.graphql';

// Services
import { getSession } from '@services/session';

// Style
import style from './Media.scss';

// Utils
import deepClear from '@utils/deepClear';

type MediaType = {
  handleLoad: Function,
  handleReset: Function,
  handleSearch: Function,
  hasSession: boolean,
  search: string,
  selectedId: string,
};

const Media = ({
  handleLoad,
  handleReset,
  handleSearch,
  hasSession,
  search,
  selectedId,
}: MediaType): React.Element<typeof Query> => (
  <Query
    fetchPolicy="network-only"
    query={getFileList}
    variables={{ contains: search }}
  >
    {({ data, error, loading, networkStatus, refetch }) => {
      const hasData = !isEmpty(data);
      const list: Array<> = deepClear(get(data, 'getFileList', []), [
        '__typename',
      ]);

      const preview: Object =
        selectedId && list.find(({ id }): boolean => id === selectedId);

      return (
        <div className={style.Root}>
          {hasData && (
            <div className={style.Container}>
              <React.Fragment>
                <div className={style.Header}>
                  <Header
                    count={list.length}
                    initialValues={{ search }}
                    onReset={handleReset}
                    onSearch={handleSearch}
                  />
                </div>

                <div className={style.Content}>
                  {list.length === 0 ? (
                    <Empty
                      loading={loading}
                      onUpdate={networkStatus !== 7 ? () => refetch() : null}
                      searching={!!search}
                    />
                  ) : (
                    <div className={style.List}>
                      <List data={list} />
                    </div>
                  )}
                </div>
              </React.Fragment>
            </div>
          )}

          <CSSTransition
            classNames={{
              enter: style.LoadingAnimateEnter,
              enterActive: style.LoadingAnimateEnterActive,
              exit: style.LoadingAnimateExit,
              exitActive: style.LoadingAnimateExitActive,
            }}
            in={loading}
            timeout={400}
            unmountOnExit
          >
            <div className={style.Loading}>
              <div className={style.Spinner}>
                <i className="far fa-spinner-third" />
              </div>
            </div>
          </CSSTransition>

          <CSSTransition
            classNames={{
              enter: style.SidebarAnimateEnter,
              enterActive: style.SidebarAnimateEnterActive,
              exit: style.SidebarAnimateExit,
              exitActive: style.SidebarAnimateExitActive,
            }}
            in={selectedId && !!preview}
            timeout={400}
            unmountOnExit
          >
            <div className={style.Sidebar}>
              <Preview {...preview} key={selectedId} />
            </div>
          </CSSTransition>

          <Upload />
        </div>
      );
    }}
  </Query>
);

const mapStateToProps: Function = (state: Object): Object => ({
  hasSession: !isEmpty(getSession(state)),
  selectedId: getSelectedId(state),
});

export default compose(
  connect(mapStateToProps),
  withState('search', 'setSearch', ''),
  withHandlers({
    handleReset: ({ setSearch }): Function => (): void => setSearch(''),
    handleSearch: ({ setSearch }): Function => ({ search = '' }): void =>
      setSearch(search.toLowerCase()),
  }),
)(Media);
