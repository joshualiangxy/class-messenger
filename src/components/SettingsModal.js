import React, { useState } from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { startSetUserData } from '../actions/user';

const SettingsModal = ({
  initialDisplayName = '',
  initialStudentNum = '',
  isOpen,
  onRequestClose,
  startSetUserData,
  isNewUser
}) => {
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [studentNum, setStudentNum] = useState(initialStudentNum);
  const [error, setError] = useState('');

  const onDisplayNameChange = e => {
    const displayName = e.target.value;
    setDisplayName(displayName);
  };

  const onStudentNumChange = e => {
    const studentNum = e.target.value;
    if (
      !studentNum ||
      studentNum.match(/^[aA]\d{0,7}$/) ||
      studentNum.match(/^[aA]\d{7}[a-zA-Z]$/)
    )
      setStudentNum(studentNum.toUpperCase());
  };

  const onCancel = () => {
    setDisplayName(initialDisplayName);
    setStudentNum(initialStudentNum);
    onRequestClose();
  };

  const onSubmit = e => {
    e.preventDefault();

    const submittedDisplayName = displayName.trim();
    if (!submittedDisplayName || !studentNum) {
      setError('Please enter display name and student number');
    } else if (!studentNum.match(/^A\d{7}[A-Z]$/)) {
      setError('Please enter a valid student number');
    } else {
      setError('');
      startSetUserData(submittedDisplayName, studentNum).then(() =>
        onRequestClose()
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      contentLabel="Settings"
      onRequestClose={() => onRequestClose(isNewUser)}
      appElement={document.getElementById('root')}
    >
      {isNewUser ? (
        <div>
          <h2>Welcome to Class Board Tasks!</h2>
          <h4>Please enter your information to get started</h4>
        </div>
      ) : (
        <h2>Settings</h2>
      )}
      {error && <p>{error}</p>}
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Display name (required)"
          value={displayName}
          onChange={onDisplayNameChange}
          autoFocus
        />
        <input
          type="text"
          placeholder="Student number (required)"
          value={studentNum}
          onChange={onStudentNumChange}
        />
        <button>Submit</button>
        <button onClick={onCancel} disabled={isNewUser}>
          Cancel
        </button>
      </form>
    </Modal>
  );
};

const mapStateToProps = state => ({
  initialDisplayName: state.user.displayName,
  initialStudentNum: state.user.studentNum
});

const mapDispatchToProps = dispatch => ({
  startSetUserData: (displayName, studentNum) =>
    dispatch(startSetUserData(displayName, studentNum))
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingsModal);
