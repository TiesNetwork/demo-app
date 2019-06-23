import { get, isEmpty, last } from 'lodash';
import * as React from 'react';
import { Query, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { compose, withHandlers } from 'recompose';

// Containers
import Empty from './containers/Empty';
import Header from './containers/Header';
import List from './containers/List';
import Preview from './containers/Preview';
import Upload from './containers/Upload';

// Ducks
import { getSelectedId } from './ducks';

// GraphQL
import createFile from './graphql/createFile.graphql';
import getFileList from './graphql/getFileList.graphql';

// Services
import { getSession } from '@services/session';

// Style
import style from './Media.scss';

// Utils
import deepClear from '@utils/deepClear';

type MediaType = {
  handleLoad: Function,
  hasSession: boolean,
  selectedId: string,
};

const Media = ({
  handleLoad,
  hasSession,
  selectedId,
}: MediaType): React.Element<typeof Query> => (
  <Query query={getFileList}>
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
              {list.length === 0 ? (
                <Empty
                  loading={loading}
                  onUpdate={networkStatus !== 7 ? () => refetch() : null}
                />
              ) : (
                <React.Fragment>
                  <div className={style.Header}>
                    <Header count={list.length} />
                  </div>

                  <div className={style.Content}>
                    {list && list.length > 0 && (
                      <div className={style.List}>
                        <List data={list} />
                      </div>
                    )}
                  </div>
                </React.Fragment>
              )}
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
              <Preview {...preview} />
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
  graphql(createFile, { name: 'createFile' }),
  connect(mapStateToProps),
  withHandlers({
    handleLoad: ({ createFile }): Function => (files: Array<Object>): void => {
      const file = get(files, '0', {});

      if (file) {
        const splittedFile = file.name.split('.');

        createFile({
          refetchQueries: [{ query: getFileList }],
          variables: {
            extension: last(splittedFile),
            name: splittedFile.slice(0, -1).join('.'),
            size: file.size,
          },
        });
      }
    },
  }),
)(Media);

// <Dropzone onDrop={handleLoad}>
//   {({ getInputProps, getRootProps, isDragActive }) => (
//  <CSSTransition
//                 classNames={{
//                   enter: style.DragAnimateEnter,
//                   enterActive: style.DragAnimateEnterActive,
//                   exit: style.DragAnimateExit,
//                   exitActive: style.DragAnimateExitActive,
//                 }}
//                 in={isDragActive}
//                 timeout={400}
//                 unmountOnExit
//               >
//                 <div className={style.Drag}>
//                   <div className={style.DragContent}>
//                     <div className={style.DragIcon}>
//                       <i className="fas fa-cloud-upload" />
//                     </div>

//                     <div className={style.DragTitle}>
//                       {`Drag and drop, or `}
//                       <label className={style.DragLabel} htmlFor="file">
//                         browse
//                         <input {...getInputProps()} id="file" />
//                       </label>
//                       {' files!'}
//                     </div>
//                   </div>
//                 </div>
//               </CSSTransition>
