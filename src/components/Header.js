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
    <header className="header">
      <div className="content-container">
        <Link className="header__title" to="/dashboard">
          <h1>Class Board Tasks</h1>
        </Link>
        <div className="header__content">
          <NavLink className="button button--link" to="/groups" exact={true}>
            Groups
          </NavLink>
          <div>
            <button className="button button--link" onClick={openSettings}>
              Settings
            </button>
            <button className="button button--link" onClick={startLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
      <SettingsModal
        isOpen={open}
        onRequestClose={onRequestClose}
        isNewUser={isNewUser}
      />
    </header>
  );
};

const mapStateToProps = state => ({ isNewUser: !!state.user.newUser });

const mapDispatchToProps = dispatch => ({
  startLogout: () => dispatch(startLogout())
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
