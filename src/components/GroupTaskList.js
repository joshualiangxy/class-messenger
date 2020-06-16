import React from 'react';
import getSortedTasks from '../selectors/tasks';
import TaskListItem from './TaskListItem';

const GroupTaskList = ({ tasks, addTask }) => {
  const sortedList = getSortedTasks(tasks);

  return (
    <div>
      {Object.keys(sortedList).length === 0 ? (
        <h3>No tasks yet</h3>
      ) : (
        Object.values(sortedList)[0].tasks.map(task => (
          <TaskListItem key={task.id} task={task} showGroup={false} />
        ))
      )}
    </div>
  );
};

export default GroupTaskList;
