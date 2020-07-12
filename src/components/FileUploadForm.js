import React, { useState, useEffect } from 'react';
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
  const [fileName, setFileName] = useState('No file chosen');

  const fileUpload = e => {
    e.preventDefault();
    e.persist();

    const element = document.getElementById(id);
    const files = element.files;
    if (files.length > 0) {
      const file = files[0];

      return Promise.resolve()
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
                  setFileName('No file chosen');
                  setError('');
                  setUploading(false);
                  e.target.reset();
                });
            }
          );
        });
    } else setError('No file selected');
  };

  const onFileChange = e => {
    const files = e.target.files;

    if (files.length > 0) setFileName(files[0].name);
    else setFileName('No file chosen');
  };

  return (
    <form className="file-upload-form" onSubmit={fileUpload}>
      {error && <p>{error}</p>}
      <input
        type="file"
        hidden="hidden"
        id={id}
        onClick={e => e.stopPropagation()}
        onChange={onFileChange}
        accept=".pdf"
        disabled={uploading}
      />
      <label className="button button--grey button--norm-grey" htmlFor={id}>
        Choose File
      </label>
      <div className="file-name">
        <p>{fileName}</p>
      </div>
      <button
        className="button button--grey button--norm-grey"
        onClick={e => e.stopPropagation()}
        disabled={uploading}
      >
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
    fileExists: task
      ? task.downloadURLs
        ? task.downloadURLs.hasOwnProperty(uid)
        : false
      : false,
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
