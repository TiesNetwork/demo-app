export default (mimetype: string = ''): string => {
  const type: string = mimetype.split('/')[0];

  switch (type) {
    case 'application':
      const subtype: string = mimetype.split('/')[1];

      switch (subtype) {
        case 'vnd.ms-excel':
          return 'fa-file-excel';
        case 'msword':
          return 'fa-file-word';
        case 'pdf':
          return 'fa-file-pdf';
        default:
          return 'fa-file';
      }
    case 'audio':
      return 'fa-file-audio';
    case 'image':
      return 'fa-file-image';
    case 'video':
      return 'fa-file-video';
    default:
      return 'fa-file';
  }
};
