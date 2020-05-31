import React from 'react';
import { connect } from 'react-redux';

export const TaskDashboardPage = () => (
  <div>
    <h1>This is the task dashboard page</h1>
  </div>
);

const mapDispatchToProps = dispatch => ({});

export default connect(undefined, mapDispatchToProps)(TaskDashboardPage);
