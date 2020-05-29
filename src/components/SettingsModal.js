import React, { useState } from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { startSetUserData } from '../actions/user';

const SettingsModal = ({
  initialDname = '',
  initialSnum = '',
  isOpen,
  onRequestClose,
  startSetUserData
}) => {
  const [dname, setDname] = useState(initialDname);
  const [snum, setSnum] = useState(initialSnum);
  const [error, setError] = useState('');

  const onDnameChange = e => {
    const dname = e.target.value;
    setDname(dname);
  };

  const onSnumChange = e => {
    const snum = e.target.value;
    setSnum(snum);
  };

  const onCancel = () => {
    setDname(initialDname);
    setSnum(initialSnum);
    onRequestClose();
  };

  const onSubmit = e => {
    e.preventDefault();

    if (!dname || !snum) {
      setError('Please enter display name and student number');
    } else {
      setError('');
      startSetUserData(dname, snum).then(() => onRequestClose());
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      contentLabel="Settings"
      onRequestClose={onRequestClose}
      appElement={document.getElementById('root')}
    >
      <h2>Settings</h2>
      {error && <p>{error}</p>}
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Display name (required)"
          value={dname}
          onChange={onDnameChange}
          autoFocus
        />
        <input
          type="text"
          placeholder="Student number (required)"
          value={snum}
          onChange={onSnumChange}
        />
        <button>Submit</button>
        <button onClick={onCancel}>Cancel</button>
      </form>
    </Modal>
  );
};

const mapDispatchToProps = dispatch => ({
  startSetUserData: (dname, snum) => dispatch(startSetUserData(dname, snum))
});

export default connect(undefined, mapDispatchToProps)(SettingsModal);
