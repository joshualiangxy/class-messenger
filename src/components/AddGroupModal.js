import React, { useState } from 'react';
import Modal from 'react-modal';
import { startNewGroup } from '../actions/groups';
import { connect } from 'react-redux';

// TODO: Add the ability to add other users into the group
export const AddGroupModal = ({ isOpen, onRequestClose, startNewGroup }) => {
  const [groupName, setGroupName] = useState('');
  const [module, setModule] = useState('');
  const [error, setError] = useState('');

  const onGroupNameChange = e => setGroupName(e.target.value);

  const onModuleChange = e => {
    const module = e.target.value.toUpperCase();

    setModule(module);
  };

  const onCancel = () => {
    setError('');
    setGroupName('');
    setModule('');
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
      setGroupName('');
      setModule('');
      startNewGroup(submittedName, submittedMod).then(() => onRequestClose());
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      contentLabel="New Group"
      onRequestClose={onCancel}
      closeTimeoutMS={200}
      appElement={document.getElementById('root')}
      className="setting-modal"
    >
      <h1>New Group</h1>
      {error && <p className="form__error">{error}</p>}
      <form onSubmit={onSubmit} className="form">
        <input
          type="text"
          className="text-input"
          placeholder="Group name (required)"
          value={groupName}
          onChange={onGroupNameChange}
          autoFocus
        />
        <input
          type="text"
          className="text-input"
          placeholder="Module code/Class name (Optional)"
          value={module}
          onChange={onModuleChange}
        />
        <div>
          <button className="button button--norm button--right">Submit</button>
          <button
            onClick={onCancel}
            className="button button--norm button--right"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

const mapDispatchToProps = dispatch => ({
  startNewGroup: (groupName, module) =>
    dispatch(startNewGroup(groupName, module))
});

export default connect(null, mapDispatchToProps)(AddGroupModal);
