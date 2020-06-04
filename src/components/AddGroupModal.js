import React, { useState } from 'react';
import Modal from 'react-modal';
import { startNewGroup } from '../actions/groups';
import { connect } from 'react-redux';

const NewGroupModal = ({ isOpen, onRequestClose, startNewGroup }) => {
  const [groupName, setGroupName] = useState('');
  const [error, setError] = useState('');

  const onGroupNameChange = e => {
    setGroupName(e.target.value);
  };

  const onCancel = () => {
    setGroupName('');
    onRequestClose();
  };

  const onSubmit = e => {
    e.preventDefault();
    if (!groupName) {
      setError('Please enter a group name');
    } else {
      setError('');
      startNewGroup(groupName).then(() => onRequestClose());
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
          placeholder="Group name (required)"
          value={groupName}
          onChange={onGroupNameChange}
          autoFocus
        />
        <button>Submit</button>
        <button onClick={onCancel}>Cancel</button>
      </form>
    </Modal>
  );
};

const mapDispatchToProps = dispatch => ({
  startNewGroup: groupName => dispatch(startNewGroup(groupName))
});

export default connect(null, mapDispatchToProps)(NewGroupModal);

