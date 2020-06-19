import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { history } from '../routers/AppRouter';
import { startLeaveGroup } from '../actions/groups';

const LeaveGroupModal = ({
  isOpen,
  onRequestClose,
  startLeaveGroup,
  gid,
  users,
  renderLoad
}) => {
  // Passing users into this modal so that we can tell if we should clean up this (empty) group or not
  const onCancel = () => {
    onRequestClose();
  };

  const onSubmit = e => {
    e.preventDefault();
    // There is another admin in the group already, or this group will be empty after leaving.
    renderLoad();
    startLeaveGroup(gid, users.length).then(() => {
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
  startLeaveGroup: (gid, count) => dispatch(startLeaveGroup(gid, count))
});

export default connect(null, mapDispatchToProps)(LeaveGroupModal);
