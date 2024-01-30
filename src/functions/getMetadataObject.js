export const getMetadataObject = (book1, book2, releaseCode) => {
  const metaDataObject = {
    book1: {
      bookTitle: {
        label: book1?.text?.title_lat_prefered,
        //path: book1?.version_uri,
        path: book1?.text?.text_uri,
      },
      url: book1?.release_version?.url,
      bookAuthor: book1?.text?.author[0]?.author_lat_prefered,
      wordCount: book1?.release_version?.tok_length,
      versionCode: book1?.version_code,
      annotationStatus: book1?.release_version?.annotation_status,
    },
    book2 :
      (book2 
      ? {
          bookTitle: {
            label: book2?.text?.title_lat_prefered,
            path: book2?.version_uri,
          },
          bookAuthor: book2?.text?.author[0]?.author_lat_prefered,
          wordCount: book2?.release_version?.tok_length,
          versionCode: book2?.version_code,
          annotationStatus: book2?.release_version?.annotation_status,
        }
      : null),
    releaseCode: releaseCode,
  };
  return metaDataObject;
};
