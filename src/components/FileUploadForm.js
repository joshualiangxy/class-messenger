import React, { useState } from 'react';
import firebase from '../firebase/firebase';
import { startUpdateDownloadURL } from '../actions/tasks';
import { uploadFile, startRemoveUserFile } from '../actions/files';
import { connect } from 'react-redux';

export const FileUploadForm = ({
  id,
  uid,
  uploadFile,
  TaskEvent,
  startUpdateDownloadURL,
  startRemoveUserFile,
  fileExists
}) => {
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const fileUpload = e => {
    e.preventDefault();
    e.persist();

    const element = document.getElementById(id);
    const files = element.files;
    if (files.length > 0) {
      const file = files[0];

      Promise.resolve()
        .then(() => {
          if (fileExists) return startRemoveUserFile(uid);
        })
        .then(() => {
          const uploadTask = uploadFile(file);

          uploadTask.on(
            TaskEvent.STATE_CHANGED,
            () => setUploading(true),
            error => {
              switch (error.code) {
                case 'storage/unauthorized':
                  setError('Not allowed to upload file!');
                  break;
                case 'storage/canceled':
                  setError('File upload cancelled');
                  break;
                default:
                  setError('File upload failed');
                  break;
              }
              setUploading(false);
            },
            () => {
              const ref = uploadTask.snapshot.ref;
              const fileName = ref.name;

              ref
                .getDownloadURL()
                .then(downloadURL => {
                  startUpdateDownloadURL(downloadURL, fileName);
                })
                .then(() => {
                  setError('');
                  setUploading(false);
                  e.target.reset();
                });
            }
          );
        });
    } else setError('No file selected');
  };

  return (
    <form onSubmit={fileUpload}>
      {error && <p>{error}</p>}
      <input
        type="file"
        id={id}
        onClick={e => e.stopPropagation()}
        accept=".pdf"
        disabled={uploading}
      />
      <button onClick={e => e.stopPropagation()} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </form>
  );
};

const mapStateToProps = ({ tasks, auth }, { id }) => {
  const uid = auth.user.uid;
  const task = tasks.find(task => task.id === id);

  return {
    TaskEvent: firebase.storage.TaskEvent,
    fileExists: task ? task.downloadURLs.hasOwnProperty(uid) : false,
    uid
  };
};

const mapDispatchToProps = (dispatch, { id, gid, namingConvention }) => ({
  uploadFile: file => dispatch(uploadFile(file, id, namingConvention)),
  startUpdateDownloadURL: (downloadURL, fileName) =>
    dispatch(startUpdateDownloadURL(id, gid, downloadURL, fileName)),
  startRemoveUserFile: uid => dispatch(startRemoveUserFile(id, uid))
});

export default connect(mapStateToProps, mapDispatchToProps)(FileUploadForm);
