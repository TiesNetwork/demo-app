import moment from 'moment';
import prettyBytes from 'pretty-bytes';
import * as React from 'react';

// Components
import Field from '../components/Field';

// Style
import style from './Preview.scss';

const MediaPreview = ({
  createdAt,
  extension,
  name,
  size,
}): React.Element<'div'> => (
  <div className={style.Root}>
    <div className={style.Title}>
      {`${name}.${extension}`}
    </div>

    <div className={style.Preview}>
      <img
        alt="test"
        className={style.PreviewContent}
        src="https://images.unsplash.com/photo-1494548162494-384bba4ab999?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80"
      />
    </div>

    <div className={style.Info}>
      <Field label="Type" value={extension.toUpperCase()} />
      <Field label="Size" value={`${prettyBytes(size)} (${size} KB)`} />
      <Field
        label="Created date"
        value={moment(createdAt).format('MMM DD, YYYY')}
      />
      <Field label="Owner" value="me" />
    </div>
  </div>
);

export default MediaPreview;
