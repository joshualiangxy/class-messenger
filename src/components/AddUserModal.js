import React, { useState } from 'react';
import Modal from 'react-modal';
import firebase from '../firebase/firebase';

// Note: This still works off uid for now. This also does NOT work yet. 
const AddUserModal = ({ isOpen, onRequestClose, group }) => {
  const addNewUser = (userEmail, group) => {
    // TODO: Fix collection paths to make it actually write properly
    // Debug user exists part - maybe just go straight to reading and catching the error?
    const uid = userEmail; // TODO: Change this when email-uid are linked!

    // Both of these references are DocumentReference
    const userRef = firebase.firestore().collection('users').doc(uid); 
    const groupRef = firebase.firestore().collection('groups').doc(group);
    
    // Gets the data from a user. 
    userRef.get().then(doc =>{
      const data = doc.data();
      console.log(data); // Should show all the data under a user's document
      // TODO: Take the fields from this data, put it into the group's users and add this group's id to the user
      // Write displayName, studentNum, and UID into a new document
      groupRef.collection('users').doc(uid) // Create document for this user's UID
        .set({
          studentNum: data.studentNum,
          displayName: data.displayName,
          uid: uid,
          admin: false
        })
      // Defaults to non-admin.
    })
  };

  // TODO: When calling this modal, pass in the group UID as a prop
  const [userEmail, setUserEmail] = useState('');
  const [error, setError] = useState('');

  const onUserEmailChange = e => {
    setUserEmail(e.target.value);
  };

  const onCancel = () => {
    setUserEmail('');
    onRequestClose();
  };

  const onSubmit = e => {
    e.preventDefault();
    const submittedEmail = userEmail.trim();
    if (!submittedEmail) {
      setError('Please enter a group name');
    } else {
      addNewUser(submittedEmail, group);
      // TODO: Catch user not found
      // Does not close after submitting, so that the user can continue to add more users

      // setUserEmail(''); // Also resets the field.
      // setError('Added!');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      contentLabel="New Group"
      onRequestClose={() => onRequestClose()}
      appElement={document.getElementById('root')}
    >
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="User ID (required)"
          value={userEmail}
          onChange={onUserEmailChange}
          autoFocus
        />
        <button>Submit</button>
        <button onClick={onCancel}>Cancel</button>
        <div>{error}</div>
      </form>
    </Modal>
  );
};

export default AddUserModal;
