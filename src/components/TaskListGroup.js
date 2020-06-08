import React from 'react';
import TaskListItem from './TaskListItem';

const TaskListGroup = ({ group }) => {
  return (
    <div>
      <h3>{group.groupName}</h3>
      {group.tasks.map((task, id) => (
        <TaskListItem key={id} task={task} />
      ))}
    </div>
  );
};

export default TaskListGroup;
