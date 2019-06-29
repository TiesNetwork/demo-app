import { get } from 'lodash';
import * as React from 'react';
import { Query } from 'react-apollo';

// Components
import Audio from '../components/Audio';

// GraphQL
import downloadFile from '@views/Media/graphql/downloadFile.graphql';

// Style
import style from './Player.scss';

const MediaContentPlayer = ({ id, mimetype }) => (
  <Query query={downloadFile} variables={{ id }}>
    {({ data, error, loading }) => {
      const buffer: Object = get(data, 'downloadFile.data');
      const blob: Blob =
        buffer && new Blob([new Uint8Array(buffer)], { type: mimetype });
      const url: URL = blob && URL.createObjectURL(blob);

      return (
        <div className={style.Root}>
          {!loading && url && <Audio blob={blob} url={url} />}
        </div>
      );
    }}
  </Query>
);

export default MediaContentPlayer;
// lifecycle({
//   componentDidMount() {
//     const {
//       downloadFile,
//       id,
//       mimetype,
//       setArtist,
//       setLoading,
//       setTitle,
//       setUrl,
//     } = this.props;

//     downloadFile({ variables: { id } }).then(({ data }) => {
//       const buffer = get(data, 'downloadFile.data');
//       const blob = new Blob([new Uint8Array(buffer)], { type: mimetype });
//       const url = URL.createObjectURL(blob);

//       jsmediatags.read(blob, {
//         onSuccess: ({ tags }) => {
//           setArtist(get(tags, 'artist'));
//           setTitle(get(tags, 'title'));
//           setLoading(false);
//           setUrl(url);
//         },
//         onError: console.error,
//       });
//     });
//   },
// }),

// <div
//   className={classNames(style.Root, { [style.RootIsLoading]: !!isLoading })}
// >
//   <div className={style.Loading}>
//     <i className="fas fa-spinner-third" />
//   </div>
//   {!isLoading && url && <Audio url={url} />}
//   <React.Fragment>
//     <div className={style.Progress}>
//       <div className={style.Spectrum}>

//       </div>

//       <input className={style.Range} name="test" type="range" />
//     </div>

//   </React.Fragment>
//   )}
// </div>
