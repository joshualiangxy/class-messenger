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
      <h1>Dashboard</h1>
      <button onClick={openAddTask}>Add Task</button>
      <TaskListFilters />
      <TaskList />
      <AddTaskModal isOpen={open} onRequestClose={onRequestClose} />
    </div>
  );
};

export default TaskDashboardPage;
