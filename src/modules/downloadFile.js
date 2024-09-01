import ReactNativeBlobUtil from 'react-native-blob-util';
import RNFS from 'react-native-fs';
export const downloadFile = async (url, fileName) => {
  const {config, fs} = ReactNativeBlobUtil;

  return config({
    // add this option that makes response data to be stored as a file,
    // this is much more performant.
    fileCache: true,
    addAndroidDownloads: {
      useDownloadManager: true,
      notification: true,
      mediaScannable: true,
      path: RNFS.DownloadDirectoryPath + '/' + fileName,
      // path: downloads + '../../../../downloads' + fileName,
    },
  })
    .fetch('GET', url)
    .then(res => {
      // the temp file path
      console.log('The file saved to ', res.path());
    })
    .catch(err => {
      console.log(err);
    });
};
