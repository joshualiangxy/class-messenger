import React, { useState } from 'react';
import firebase from '../firebase/firebase';
import AddGroupModal from './AddGroupModal';

const getGroups = () => {
  const uid = firebase.auth().currentUser.uid;
  const userRef = firebase.firestore().collection('users').doc(uid);
  // This is able to get a *promise* for a group array, but not the actual array itself.
  return userRef.get().then(doc => {
    const groups = [];
    console.log(doc.get('groups'));
    groups.push(doc.get('groups'));
    return groups;
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
