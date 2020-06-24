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
  renderLoad,
  admin,
  uid
}) => {
  const [canLeave, setCanLeave] = useState(false);

  // For determining if a user should be allowed to leave
  useEffect(() => {
    if (users.length <= 1) {
      // This user is the only one in the group, so let him leave.
      setCanLeave(true);
    } else if (users.find(user => user.uid !== uid && user.admin)) {
      // There is another user in this group who is an admin.
      setCanLeave(true);
    } else if (!admin) {
      // This person is not an admin.
      setCanLeave(true);
    } else {
      // This person is an admin, there are other people in the group, and there aren't any other admins.
      setCanLeave(false); // Can't leave.
    }
  }, [users, admin, uid]);

  // Passing users into this modal so that we can tell if we should clean up this (empty) group or not
  const onCancel = () => {
    onRequestClose();
  };

  const onSubmit = e => {
    e.preventDefault();
    // There is another admin in the group already, or this group will be empty after leaving.
    renderLoad();
    history.push('/groups');
    startLeaveGroup(gid, users.length).then(() => onRequestClose());
  };

  return (
    <Modal
      isOpen={isOpen}
      contentLabel="Leave Group"
      onRequestClose={() => onRequestClose()}
      appElement={document.getElementById('root')}
    >
      {canLeave && (
        <div>
          <h3>Do you want to leave?</h3>
          <button onClick={onSubmit}>Yes</button>
          <button onClick={onCancel}>No</button>
        </div>
      )}
      {!canLeave && (
        <div>
          <h3>You cannot leave this group.</h3>
          <button onClick={onCancel}>Return</button>
        </div>
      )}
    </Modal>
  );
};

const mapDispatchToProps = dispatch => ({
  startLeaveGroup: (gid, count) => dispatch(startLeaveGroup(gid, count))
});

export default connect(null, mapDispatchToProps)(LeaveGroupModal);
