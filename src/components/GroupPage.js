import React, { useState } from 'react';
import firebase from '../firebase/firebase';
import { connect } from 'react-redux';
import AddUserModal from './AddUserModal';

const GroupPage = props => {
  const groupId = props.match.params.id;
  // var isAuthenticated = props.groups.includes(groupId); // Not working yet because groups haven't been stored yet
  var isAuthenticated = true; // TODO: Remove this once isAuthenticated works properly. For now, anyone can go to any group.
  // var isAdmin = true; // Not used right now, but may be useful to store it here for any admin operations later.

  // For Modal
  const [isOpen, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const userArray = [];
  // TODO: Fix this to be able to get all the users. 
  firebase.firestore().collection('groups').doc(groupId).collection('users')
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        userArray.push(doc.displayName)
      })
    })
    .then(() => setUsers(userArray))

  const onRequestClose = () => {
    setOpen(false);
  };

  const openAddUser = () => {
    setOpen(true);
  };

  return isAuthenticated ? (
    <div>
      <h1>Group Page {groupId}</h1>
      <button onClick={openAddUser}>Add new user</button>
      <button onClick={() => console.log(userArray)}>get users</button>
      <AddUserModal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        group={groupId}
      />
    </div>
  ) : (
    <div>
      <h1>You are not in this group</h1>
    </div>
  );
};

// groups should be an array of group IDs, and this only needs to check if the current group ID matches something in this array
const mapStateToProps = state => ({
  groups: state.groups
});

export default GroupPage;
