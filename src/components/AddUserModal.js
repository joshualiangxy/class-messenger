import React, { useState } from 'react';
import Modal from 'react-modal';
import firebase from '../firebase/firebase';
import { connect } from 'react-redux';
import {addNewUser} from '../actions/groups';

// Note: This still works off uid for now. This also does NOT work yet.
const AddUserModal = ({ isOpen, onRequestClose, group }) => {
  // TODO: When calling this modal, pass in the group UID as a prop
  const [userEmail, setUserEmail] = useState('');
  const [error, setError] = useState('');
  // const [usersAdded, setUsersAdded] = useState([]); // For listing down people that have been added?

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
      addNewUser(submittedEmail, group, setError);
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

const mapDispatchToProps = dispatch => ({
  addNewUser: (userEmail, group, setError) => dispatch(addNewUser(userEmail, group, setError))
})

export default AddUserModal;
