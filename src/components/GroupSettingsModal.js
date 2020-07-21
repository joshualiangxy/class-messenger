import React, { useState } from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { addNewUser, getUser, recheckAdmin } from '../actions/groups';
import GroupUserListing from './GroupUserListing';

export const GroupSettingsModal = ({
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
      return recheckAdmin(uid, group).then(isAdmin => {
        if (isAdmin) {
          return getUser(submittedEmail).then(user => {            
            const newuser = {...user, admin: false}
            if (typeof user !== 'undefined') {
              return addNewUser(newuser, group)
                .then(() => {
                  setUsers([...users, newuser]);
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
          setError('You are not an admin!');
        }
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      contentLabel="Settings"
      onRequestClose={() => onRequestClose()}
      appElement={document.getElementById('root')}
      className="setting-modal"
      closeTimeoutMS={200}
    >
      <h1>Group Settings</h1>
      <div>
        {admin && (
          <form onSubmit={onSubmit} className="form">
            <input
              type="text"
              className="text-input"
              placeholder="Email (required)"
              value={userEmail}
              onChange={onUserEmailChange}
              autoFocus
            />
            {error && <p className="form__error">{error}</p>}
            <div>
              <button className="button button--norm">Add to list</button>{' '}
              <button onClick={onCancel} className="button button--norm">
                Cancel
              </button>
            </div>
          </form>
        )}
        {!admin && (
          <button onClick={onCancel} className="button button--norm">
            Close
          </button>
        )}
        <h2>Users:</h2>
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
      </div>
    </Modal>
  );
};

const mapDispatchToProps = dispatch => ({
  addNewUser: (uid, gid) => dispatch(addNewUser(uid, gid))
});

export default connect(null, mapDispatchToProps)(GroupSettingsModal);
