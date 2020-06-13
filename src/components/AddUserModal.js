import React, { useState } from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import {addNewUser} from '../actions/groups';

const AddUserModal = ({ isOpen, onRequestClose, group }) => {  
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

export default connect(null, mapDispatchToProps)(AddUserModal);
