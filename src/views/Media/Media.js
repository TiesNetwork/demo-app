import { get, isEmpty, last } from 'lodash';
import * as React from 'react';
import { Query, graphql } from 'react-apollo';
import Dropzone from 'react-dropzone';
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { compose, withHandlers } from 'recompose';

// Containers
import Header from './containers/Header';
import List from './containers/List';
import Preview from './containers/Preview';

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
    {({ data, error, loading }) => {
      const list: Array<> = deepClear(get(data, 'getFileList', []), [
        '__typename',
      ]);

      const preview: Object =
        selectedId && list.find(({ id }): boolean => id === selectedId);

      return (
        <Dropzone onDrop={handleLoad}>
          {({ getInputProps, getRootProps, isDragActive }) => (
            <div {...getRootProps()} className={style.Root}>
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
                  <Preview
                    {...preview}
                    initialValues={preview}
                    onSubmit={console.log}
                  />
                </div>
              )}

              <CSSTransition
                classNames={{
                  enter: style.DragAnimateEnter,
                  enterActive: style.DragAnimateEnterActive,
                  exit: style.DragAnimateExit,
                  exitActive: style.DragAnimateExitActive,
                }}
                in={isDragActive}
                timeout={400}
                unmountOnExit
              >
                <div className={style.Drag}>
                  <div className={style.DragContent}>
                    <div className={style.DragIcon}>
                      <i className="fas fa-cloud-upload" />
                    </div>

                    <div className={style.DragTitle}>
                      {`Drag and drop, or `}
                      <label className={style.DragLabel} htmlFor="file">
                        browse
                        <input {...getInputProps()} id="file" />
                      </label>
                      {' files!'}
                    </div>
                  </div>
                </div>
              </CSSTransition>
            </div>
          )}
        </Dropzone>
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
