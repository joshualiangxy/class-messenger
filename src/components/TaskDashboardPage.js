import React, { useState } from 'react';
import AddTaskModal from './AddTaskModal';
import TaskListFilters from './TaskListFilters';
import TaskList from './TaskList';

const TaskDashboardPage = () => {
  const [open, setOpen] = useState(false);

  const openAddTask = () => {
    setOpen(true);
  };

  const onRequestClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <div className="page-header">
        <div className="content-container">
          <h1 className="page-header__title">Dashboard</h1>
          <button
            className="button button--norm page-header__actions"
            onClick={openAddTask}
          >
            Add Task
          </button>
        </div>
      </div>
      <TaskListFilters />
      <TaskList />
      <AddTaskModal isOpen={open} onRequestClose={onRequestClose} />
    </div>
  );
};

export default TaskDashboardPage;
