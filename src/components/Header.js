import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import SettingsModal from './SettingsModal';
import { startLogout } from '../actions/auth';
import { removeUserData } from '../actions/user';

export const Header = ({ startLogout, isNewUser }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isNewUser) setOpen(true);
  }, [isNewUser]);

  const openSettings = () => {
    setOpen(true);
  };

  const onRequestClose = isNewUser => {
    if (!isNewUser) setOpen(false);
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
      <SettingsModal
        isOpen={open}
        onRequestClose={onRequestClose}
        isNewUser={isNewUser}
      />
    </div>
  );
};

const mapStateToProps = state => ({ isNewUser: !!state.user.newUser });

const mapDispatchToProps = dispatch => ({
  startLogout: () => {
    dispatch(removeUserData());
    dispatch(startLogout());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
