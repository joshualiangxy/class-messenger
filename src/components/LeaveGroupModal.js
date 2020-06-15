import React, { useState } from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { history } from '../routers/AppRouter';
import { startLeaveGroup } from '../actions/groups';

const LeaveGroupModal = ({ isOpen, onRequestClose, startLeaveGroup, gid }) => {
  const onCancel = () => {
    onRequestClose();
  };

  const onSubmit = e => {
    e.preventDefault();
    startLeaveGroup(gid).then(() => {
      onRequestClose();
      history.push('/groups');
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      contentLabel="Leave Group"
      onRequestClose={() => onRequestClose()}
      appElement={document.getElementById('root')}
    >
      <h3>Do you want to leave?</h3>
      <button onClick={onSubmit}>Yes</button>
      <button onClick={onCancel}>No</button>
    </Modal>
  );
};

const mapDispatchToProps = dispatch => ({
  startLeaveGroup: gid => dispatch(startLeaveGroup(gid))
});

export default connect(null, mapDispatchToProps)(LeaveGroupModal);
