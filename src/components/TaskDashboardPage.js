import React from 'react';
import { connect } from 'react-redux';
import { startLogout } from '../actions/auth';

export const TaskDashboardPage = ({ startLogout }) => (
  <div>
    <h1>This is the task dashboard page</h1>
    <button onClick={startLogout}>Logout</button>
  </div>
);

const mapDispatchToProps = dispatch => ({
  startLogout: () => dispatch(startLogout())
});

export default connect(undefined, mapDispatchToProps)(TaskDashboardPage);
