import React, { useState } from 'react';
import firebase from 'firebase';
import database from '../firebase/firebase';
import AddGroupModal from './AddGroupModal';

const getGroups = () => {
  const uid = firebase.auth().currentUser.uid;
  const userRef = database.collection('users').doc(uid);
  // This is able to get a *promise* for a group array, but not the actual array itself.
  return userRef.get().then(doc => {
    console.log(doc.get('displayName'));
    return doc.get('groups');
  });
};

const GroupListPage = () => {
  const [open, setOpen] = useState(false);

  const onRequestClose = () => {
    setOpen(false);
  };

  const openNewGroup = () => {
    setOpen(true);
  };

  return (
    <div>
      <h1>GroupListPage</h1>
      <button onClick={openNewGroup}>Add New Group</button>
      <button onClick={() => console.log(getGroups())}>Get groups</button>
      {
        // TODO: Map groups to <Link to={groupID}> or something like that here.
      }
      <AddGroupModal isOpen={open} onRequestClose={onRequestClose} />
    </div>
  );
};

export default GroupListPage;
