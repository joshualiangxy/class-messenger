import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import SettingsModal from './SettingsModal';
import { startLogout } from '../actions/auth';

export const Header = ({ startLogout }) => {
  const [open, setOpen] = useState(false);

  const openSettings = () => {
    setOpen(true);
  };

  const onRequestClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Link to="/dashboard">
        <h2>Class Board Task</h2>
      </Link>
      <NavLink to="/groups" exact={true}>
        Groups
      </NavLink>
      <button onClick={openSettings}>Settings</button>
      <button onClick={startLogout}>Logout</button>
      <SettingsModal isOpen={open} onRequestClose={onRequestClose} />
    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  startLogout: () => dispatch(startLogout())
});

export default connect(undefined, mapDispatchToProps)(Header);
