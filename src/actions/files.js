import firebase from '../firebase/firebase';
import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';
import { saveAs } from 'file-saver';

const renameFile = (original, newName) =>
  new File([original], newName, {
    type: original.type,
    lastModified: original.lastModified
  });

export const uploadFile = (file, id, nameConvention) => {
  return (dispatch, getState) => {
    let fileName = file.name;
    const uid = getState().auth.user.uid;
    const fileExtension =
      fileName.substring(file.name.lastIndexOf('.'), file.name.length) ||
      fileName;

    if (nameConvention) {
      const studentNum = getState().user.studentNum;
      file = renameFile(
        file,
        `${studentNum}_${nameConvention}${fileExtension}`
      );
    }
    fileName = file.name;

    return firebase.storage().ref(`${id}/${uid}/${fileName}`).put(file);
  };
};

export const downloadFile = (gid, id) => {
  return () =>
    firebase
      .firestore()
      .collection('groups')
      .doc(gid)
      .collection('tasks')
      .doc(id)
      .get()
      .then(snapshot => {
        const downloadURLs = Object.values(snapshot.get('downloadURLs'));
        const zip = new JSZip();

        downloadURLs.forEach(async ({ downloadURL, fileName }) => {
          await JSZipUtils.getBinaryContent(downloadURL, {
            done(data) {
              zip.file(fileName, data, { base64: true });
            },
            fail(err) {
              throw err;
            }
          });
        });

        return Promise.all(promises)
          .then(() => zip.generateAsync({ type: 'blob' }))
          .then(blob => saveAs(blob, 'submissions.zip'));
      });
};

export const startRemoveUserFile = (id, uid) => {
  return () => {
    const ref = firebase.storage().ref(`${id}/${uid}`);

    return ref.listAll().then(dir => {
      const promises = [];
      dir.items.forEach(item => promises.push(item.delete()));

      return Promise.all(promises);
    });
  };
};
