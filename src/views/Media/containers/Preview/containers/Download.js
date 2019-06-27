import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { reduxForm } from 'redux-form';
import { compose } from 'recompose';

// Components
import Button from '@components/Button';
import Form from '@components/Form';

// Ducks
import { MEDIA_DOWNLOAD_FORM_ID } from '@views/Media/ducks';

const MediaPreviewDownload = ({ disabled, handleSubmit, submitting }) => (
  <Form onSubmit={handleSubmit}>
    <Button
      color="success"
      disabled={disabled}
      fullWidth
      icon="fas fa-cloud-download-alt"
      loading={submitting}
      type="submit"
    >
      <FormattedMessage
        defaultMessage={disabled ? 'File content not found' : 'Download'}
        id={
          disabled
            ? 'media.preview.download.error'
            : 'media.preview.download.action'
        }
      />
    </Button>
  </Form>
);

export default compose(
  reduxForm({
    form: MEDIA_DOWNLOAD_FORM_ID,
  }),
)(MediaPreviewDownload);
