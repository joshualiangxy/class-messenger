import React, { useState } from 'react';
import { connect } from 'react-redux';
import AddTaskModal from './AddTaskModal';
import TaskListFilters from './TaskListFilters';
import TaskList from './TaskList';

export const TaskDashboardPage = () => {
  const [open, setOpen] = useState(false);

  const openAddTask = () => {
    setOpen(true);
  };

  const onRequestClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <h1>This is the task dashboard page</h1>
      <TaskListFilters />
      <TaskList />
      <button onClick={openAddTask}>Add Task</button>
      <AddTaskModal isOpen={open} onRequestClose={onRequestClose} />
    </div>
  );
};

const mapDispatchToProps = dispatch => ({});

export default connect(undefined, mapDispatchToProps)(TaskDashboardPage);
