import React, { useState } from 'react';
import firebase from 'firebase';
import database from '../firebase/firebase';
import NewGroupModal from './NewGroupModal';


// Returns an array containing all of the groups associated with this user as objects. 
function getGroups() {
  const uid = firebase.auth().currentUser.uid;
  const userRef = database.collection('users').doc(uid);
  const groups = [];
  // This part gets all the groups' names and references and adds them to the groups array. 
  userRef.collection('groups').get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        groups.push(doc.data())
      })
    })
  return groups;
}

const GroupListPage = () => {
  const [open, setOpen] = useState(false);

  const onRequestClose = () => {
    setOpen(false);
  }  

  const openNewGroup = () => {
    setOpen(true)
  }

  return (<div>
    <h1>GroupListPage</h1>
    <button onClick={openNewGroup}>Add New Group</button>
    <button onClick={() => console.log(getGroups())}>Get groups</button>
    <NewGroupModal
      isOpen={open}
      onRequestClose={onRequestClose}/>
  </div>
);}

export default GroupListPage;
