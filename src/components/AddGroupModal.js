import React, { useState } from 'react';
import Modal from 'react-modal';
import { startNewGroup } from '../actions/groups';
import { connect } from 'react-redux';

// TODO: Add the ability to add other users into the group
const AddGroupModal = ({ isOpen, onRequestClose, startNewGroup }) => {
  const [groupName, setGroupName] = useState('');
  const [module, setModule] = useState('');
  const [error, setError] = useState('');

  const onGroupNameChange = e => {
    setGroupName(e.target.value);
  };

  const onModuleChange = e => {
    setModule(e.target.value);
  };

  const onCancel = () => {
    setGroupName('');
    onRequestClose();
  };

  const onSubmit = e => {
    e.preventDefault();
    const submittedName = groupName.trim();
    const submittedMod = module.trim();
    if (!submittedName) {
      setError('Please enter a group name');
    } else {
      setError('');
      startNewGroup(submittedName, submittedMod).then(() => onRequestClose());
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
        <input
          type="text"
          placeholder="Module code (Optional)"
          value={module}
          onChange={onModuleChange}
        />
        <button>Submit</button>
        <button onClick={onCancel}>Cancel</button>
        <div>{error}</div>
      </form>
    </Modal>
  );
};

const mapDispatchToProps = dispatch => ({
  startNewGroup: (groupName, module) =>
    dispatch(startNewGroup(groupName, module))
});

export default connect(null, mapDispatchToProps)(AddGroupModal);
