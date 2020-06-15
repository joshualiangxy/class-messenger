import React, { useState } from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { addNewUser, getUser } from '../actions/groups';

const AddUserModal = ({ isOpen, onRequestClose, group }) => {
  // TODO: Change this implementation to create a list of users to add -> add all users at once.
  // Need to change setError to return a Promise<Boolean>?
  const [userEmail, setUserEmail] = useState('');
  const [error, setError] = useState('');
  const [usersAdded, setUsersAdded] = useState([]); // For listing down people that have been added?

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
      setError('Please enter an email');
    } else {
      // Retrieve the user's data, and add it to the array of users.
      getUser(submittedEmail)
        .then(user => {
          if (typeof user === 'undefined') {
            setUsersAdded([...usersAdded, user]);
            setError('Added!');
            setUserEmail('');
          } else {
            setError('No user found');
          }
        })
      // addNewUser(submittedEmail, group, setError);
    }
  };

  const submitAll = () => console.log(usersAdded)

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
          placeholder="Email (required)"
          value={userEmail}
          onChange={onUserEmailChange}
          autoFocus
        />
        <button>Add to list</button>
        <button onClick={onCancel}>Cancel</button>
        <div>{error}</div>
      </form>
      <h3>Added Users:</h3>
      {usersAdded.map(user => (
        <div key={user.studentNum}>{user.displayName}</div>
      ))}
      <button onClick={submitAll}>Add all to group</button>
    </Modal>
  );
};

const mapDispatchToProps = dispatch => ({
  addNewUser: (uid, gid) => dispatch(addNewUser(uid, gid)),
  getUser: email => dispatch(getUser(email))
});

export default connect(null, mapDispatchToProps)(AddUserModal);
