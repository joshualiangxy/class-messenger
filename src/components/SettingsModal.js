import React, { useState } from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { startSetUserData } from '../actions/user';

export const SettingsModal = ({
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
    if (isNewUser) {
      setError('Please submit display name and student number');
      return;
    } else {
      setError('');
      setDisplayName(initialDisplayName);
      setStudentNum(initialStudentNum);
      onRequestClose(false);
    }
  };

  const onSubmit = e => {
    e.preventDefault();

    const submittedDisplayName = displayName.trim();
    if (
      !submittedDisplayName &&
      (!studentNum || !studentNum.match(/^A\d{7}[A-Z]$/))
    ) {
      setError('Please enter display name and student number');
    } else if (!submittedDisplayName) {
      setError('Please enter display name');
    } else if (!studentNum.match(/^A\d{7}[A-Z]$/)) {
      setError('Please enter a valid student number');
    } else {
      setError('');
      onRequestClose(true);
      return startSetUserData(submittedDisplayName, studentNum);
    }
  };

  return (
    <Modal
      className="setting-modal"
      isOpen={isOpen}
      contentLabel="Settings"
      onRequestClose={onCancel}
      appElement={document.getElementById('root')}
      closeTimeoutMS={200}
    >
      {isNewUser ? (
        <div>
          <h1>Welcome to Class Board Tasks!</h1>
          <p>Please enter your information to get started</p>
        </div>
      ) : (
        <h1>Settings</h1>
      )}
      <form className="form" onSubmit={onSubmit}>
        {error && <p className="form__error">{error}</p>}
        <input
          className="text-input"
          type="text"
          placeholder="Display name (required)"
          value={displayName}
          onChange={onDisplayNameChange}
          autoFocus={true}
        />
        <input
          className="text-input"
          type="text"
          placeholder="Student number (required)"
          value={studentNum}
          onChange={onStudentNumChange}
        />
        <div>
          <button className="button button--norm button--right">Submit</button>
          <button
            className="button button--norm"
            type="button"
            onClick={onCancel}
            disabled={isNewUser}
          >
            Cancel
          </button>
        </div>
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
