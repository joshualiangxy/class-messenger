import React, { useState, useEffect } from 'react';
import TaskListItem from './TaskListItem';
import getSortedTasks from '../selectors/tasks';
import TaskListHeader from './TaskListHeader';

const GroupTaskList = ({
  removeUserFromTask,
  removeAdmin,
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
    <div className="content-container list">
      <TaskListHeader isGroup={true} />
      {sortedList.others.tasks.length === 0 ? (
        <div className="list-item__header list-item__header-message">
          <p>No tasks yet</p>
        </div>
      ) : (
        Object.values(sortedList)[0].tasks.map(task => (
          <TaskListItem
            key={task.id}
            removeUserFromTask={removeUserFromTask}
            removeAdmin={removeAdmin}
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
