import classNames from 'classnames';
import { get } from 'lodash';
import * as React from 'react';
import { Query } from 'react-apollo';

// Components
import Audio from '../components/Audio';
import Video from '../components/Video';

// GraphQL
import getFileContent from '@views/Media/graphql/getFileContent.graphql';

// Style
import style from './Player.scss';

const MediaContentPlayer = ({ id, mimetype = '' }) => (
  <Query
    fetchPolicy="no-cache" query={getFileContent}
    variables={{ id }}
  >
    {({ data, error, loading }) => {
      const buffer: Object = get(data, 'getFileContent.data');
      const blob: Blob =
        buffer && new Blob([new Uint8Array(buffer)], { type: mimetype });
      const type: string = mimetype.split('/')[0];
      const url: URL = blob && URL.createObjectURL(blob);

      return (
        <div
          className={classNames(
            style.Root,
            {
              [style.RootVariantAudio]: type === 'audio',
              [style.RootVariantImage]: type === 'image',
              [style.RootVariantVideo]: type === 'video',
            },
            {
              [style.RootIsLoading]: !!loading,
            },
          )}
        >
          <div className={style.Loading}>
            <i className="fas fa-spinner-third" />
          </div>

          <div className={style.Content}>
            {!loading && url && (
              <React.Fragment>
                {type === 'audio' && <Audio blob={blob} url={url} />}
                {type === 'video' && <Video url={url} />}
                {type === 'image' && (
                  <img
                    alt={id} className={style.Image}
                    src={url}
                  />
                )}
              </React.Fragment>
            )}
          </div>
        </div>
      );
    }}
  </Query>
);

export default MediaContentPlayer;
