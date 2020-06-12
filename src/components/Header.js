import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import SettingsModal from './SettingsModal';
import { startLogout } from '../actions/auth';

export const Header = ({ startLogout, isNewUser }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isNewUser) setOpen(true);
  }, [isNewUser]);

  const openSettings = () => setOpen(true);

  const onRequestClose = submitting => {
    if (!isNewUser || submitting) setOpen(false);
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
  startLogout: () => dispatch(startLogout())
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
