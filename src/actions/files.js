import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';
import { saveAs } from 'file-saver';
import { storage, firestore } from '../firebase/firebase';

export const renameFile = (original, newName) =>
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
      fileName = file.name;
    }

    return storage.ref(`${id}/${uid}/${fileName}`).put(file);
  };
};

export const downloadFile = (gid, id) => {
  return (dispatch, getState) => {
    const groupRef = firestore.collection('groups').doc(gid);
    const uid = getState().auth.user.uid;

    return groupRef
      .collection('users')
      .doc(uid)
      .get()
      .then(userSnapshot => userSnapshot.exists && userSnapshot.get('admin'))
      .then(isAdmin => {
        if (isAdmin)
          return groupRef
            .collection('tasks')
            .doc(id)
            .get()
            .then(snapshot => {
              const downloadURLs = Object.values(snapshot.get('downloadURLs'));
              const zip = new JSZip();
              const promises = [];

              downloadURLs.forEach(({ downloadURL, fileName }) => {
                promises.push(
                  JSZipUtils.getBinaryContent(downloadURL).then(data =>
                    zip.file(fileName, data, { base64: true })
                  )
                );
              });

              return Promise.all(promises)
                .then(() => zip.generateAsync({ type: 'blob' }))
                .then(blob => saveAs(blob, 'submissions.zip'));
            })
            .then(() => true);
        else return false;
      });
  };
};

export const startRemoveUserFile = (id, uid) => {
  return () => {
    const ref = storage.ref(`${id}/${uid}`);

    return ref.listAll().then(dir => {
      const promises = [];
      dir.items.forEach(item => promises.push(item.delete()));

      return Promise.all(promises);
    });
  };
};

export const startRemoveTaskFile = id => {
  return dispatch => {
    return storage
      .ref(id)
      .listAll()
      .then(uidResult => {
        const promises = [];

        uidResult.prefixes.forEach(uidRef =>
          promises.push(dispatch(startRemoveUserFile(id, uidRef.name)))
        );

        return Promise.all(promises);
      });
  };
};
