import React, { useState } from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { addNewUser, getUser } from '../actions/groups';
import UserListing from './UserListing';

const GroupSettingsModal = ({
  isOpen,
  onRequestClose,
  group,
  users,
  setUsers,
  admin
}) => {
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
      setError('Please enter an email');
    } else {
      // Retrieve the user's data, and add it to the array of users.
      // user contains {admin, displayName, studentNum, uid} fields
      getUser(submittedEmail).then(user => {
        if (typeof user !== 'undefined') {
          addNewUser(user, group)
            .then(() => {
              setUsers([...users, user]);
              setError('Added!');
              setUserEmail('');
            })
            .catch(() => {
              setError('Something went wrong');
            });
        } else {
          setError('No user found');
        }
      });
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
          placeholder="Email (required)"
          value={userEmail}
          onChange={onUserEmailChange}
          autoFocus
        />
        <button>Add to list</button>
        <button onClick={onCancel}>Cancel</button>
        <div>{error}</div>
      </form>
      <h3>Users:</h3>
      <UserListing
        users={users}
        setUsers={setUsers}
        group={group}
        admin={admin}
      />
    </Modal>
  );
};

const mapDispatchToProps = dispatch => ({
  addNewUser: (uid, gid) => dispatch(addNewUser(uid, gid)),
  getUser: email => dispatch(getUser(email))
});

export default connect(null, mapDispatchToProps)(GroupSettingsModal);
