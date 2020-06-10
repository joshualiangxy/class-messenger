import React from 'react';
import { connect } from 'react-redux';
import getSortedTasks from '../selectors/tasks';
import TaskListGroup from './TaskListGroup';
import TaskListItem from './TaskListItem';

export const TaskList = ({ tasks, filters }) => {
  const sortedList = getSortedTasks(tasks, filters);
  return (
    <div>
      {tasks.length === 0 ? (
        <h3>No tasks yet</h3>
      ) : filters.grouped ? (
        Object.values(sortedList).map((group, id) => (
          <TaskListGroup key={Object.keys(sortedList)[id]} group={group} />
        ))
      ) : (
        Object.values(sortedList)[0].tasks.map(task => (
          <TaskListItem key={task.id} task={task} showGroup={true} />
        ))
      )}
    </div>
  );
};

const mapStateToProps = ({ tasks, filters }) => ({ tasks, filters });

export default connect(mapStateToProps)(TaskList);
