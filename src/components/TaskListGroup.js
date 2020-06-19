import React from 'react';
import TaskListItem from './TaskListItem';

const TaskListGroup = ({ group }) => (
  <div>
    <h3>{group.groupName}</h3>
    {group.tasks.map(task => (
      <TaskListItem
        key={task.id}
        task={task}
        showGroup={false}
        dashboard={true}
      />
    ))}
  </div>
);

export default TaskListGroup;
