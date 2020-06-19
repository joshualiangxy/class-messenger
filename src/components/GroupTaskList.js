import React, { useState, useEffect } from 'react';
import TaskListItem from './TaskListItem';
import getSortedTasks from '../selectors/tasks';

const GroupTaskList = ({
  tasks,
  users,
  admin,
  editGroupTask,
  removeGroupTask,
  toggleGroupTaskComplete,
  groupName
}) => {
  const [sortedList, setSortedList] = useState(getSortedTasks(tasks));

  useEffect(() => {
    setSortedList(getSortedTasks(tasks));
  }, [tasks]);

  return (
    <div>
      {Object.keys(sortedList).length === 0 ? (
        <h3>No tasks yet</h3>
      ) : (
        Object.values(sortedList)[0].tasks.map(task => (
          <TaskListItem
            key={task.id}
            users={users}
            task={task}
            showGroup={false}
            admin={admin}
            groupName={groupName}
            editGroupTask={editGroupTask}
            removeGroupTask={removeGroupTask}
            toggleGroupTaskComplete={toggleGroupTaskComplete}
          />
        ))
      )}
    </div>
  );
};

export default GroupTaskList;
