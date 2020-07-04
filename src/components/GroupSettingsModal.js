import React, { useState } from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { addNewUser, getUser, recheckAdmin } from '../actions/groups';
import GroupUserListing from './GroupUserListing';

const GroupSettingsModal = ({
  isOpen,
  onRequestClose,
  group,
  users,
  setUsers,
  admin,
  setAdmin,
  uid,
  kickUserLocal
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
    const submittedEmail = userEmail.trim().toLowerCase();

    if (!submittedEmail) {
      setError('Please enter an email');
    } else {
      // Retrieve the user's data, and add it to the array of users.
      // user contains {admin, displayName, studentNum, uid} fields
      recheckAdmin(uid, group).then(isAdmin => {
        if (isAdmin) {
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
        } else {
          // This user is not an admin anymore
          setAdmin(false);
          setError('You are not an admin!')
        }
      })

    }
  };

  return (
    <Modal
      isOpen={isOpen}
      contentLabel="New Group"
      onRequestClose={() => onRequestClose()}
      appElement={document.getElementById('root')}
    >
      {admin && (<form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Email (required)"
          value={userEmail}
          onChange={onUserEmailChange}
          autoFocus
        />
        <button>Add to list</button>
        <div>{error}</div>
      </form>      )}
      <button onClick={onCancel}>Close</button>
      <h3>Users:</h3>
      <GroupUserListing
        users={users}
        setUsers={setUsers}
        group={group}
        admin={admin}
        setAdmin={setAdmin}
        uid={uid}
        kickUserLocal={kickUserLocal}
        setError={setError}
      />
    </Modal>
  );
};

const mapDispatchToProps = dispatch => ({
  addNewUser: (uid, gid) => dispatch(addNewUser(uid, gid)),
  getUser: email => dispatch(getUser(email))
});

export default connect(null, mapDispatchToProps)(GroupSettingsModal);
