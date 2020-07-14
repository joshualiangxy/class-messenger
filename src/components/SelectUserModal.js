import React from 'react';
import Modal from 'react-modal';
import UserList from './UserList';

const SelectUserModal = ({
  users,
  groupCompletedState,
  removeUser,
  addUser,
  isOpen,
  onRequestClose
}) => (
  <Modal
    className="select-user-modal"
    isOpen={isOpen}
    contentLabel="Select User"
    onRequestClose={onRequestClose}
    closeTimeoutMS={200}
    appElement={document.getElementById('root')}
  >
    <h2>Select users</h2>
    <UserList
      users={users}
      removeUser={removeUser}
      addUser={addUser}
      groupCompletedState={groupCompletedState}
    />
    <button className="button button--norm" onClick={onRequestClose}>
      Done
    </button>
  </Modal>
);

export default SelectUserModal;
