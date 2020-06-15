import React, { useState } from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { startLeaveGroup } from '../actions/groups';

const LeaveGroupModal = ({ isOpen, onRequestClose, startLeaveGroup, gid, onLeave }) => {
  const onCancel = () => {
    onRequestClose();
  };

  const onSubmit = e => {
    e.preventDefault();
    startLeaveGroup(gid).then(() => {
      onRequestClose();
      onLeave();
    })
  };

  return (
    <Modal
      isOpen={isOpen}
      contentLabel="Leave Group"
      onRequestClose={() => onRequestClose()}
      appElement={document.getElementById('root')}
    >
      <button onClick={onSubmit}>Yes, leave the group</button>
      <button onClick={onCancel}>Cancel</button>
    </Modal>
  );
};

const mapDispatchToProps = dispatch => ({
  startLeaveGroup: gid => dispatch(startLeaveGroup(gid))
});

export default connect(null, mapDispatchToProps)(LeaveGroupModal);