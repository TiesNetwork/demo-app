/* eslint-disable */
import * as React from 'react';

type MediaContentVideoPropTypes = {
  mimetype: string,
  url: string,
};

const MediaContentVideo = ({
  mimetype,
  url,
}: MediaContentVideoPropTypes): React.Element<'div'> => (
  <video controls>
    <source src={url} type={mimetype} />
  </video>
);

export default MediaContentVideo;
