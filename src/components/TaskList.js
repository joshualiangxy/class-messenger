import React from 'react';
import { connect } from 'react-redux';
import getSortedTasks from '../selectors/tasks';
import TaskListHeader from './TaskListHeader';
import TaskListGroup from './TaskListGroup';
import TaskListItem from './TaskListItem';

export const TaskList = ({ sortedList, grouped }) => (
  <div className="content-container list">
    <TaskListHeader />
    {Object.keys(sortedList).length === 1 &&
    sortedList.others.tasks.length === 0 ? (
      <div className="list-item__header list-item__header-message">
        <p>No tasks yet</p>
      </div>
    ) : grouped ? (
      Object.values(sortedList).map((group, id) => {
        if (group.tasks.length > 0)
          return (
            <TaskListGroup key={Object.keys(sortedList)[id]} group={group} />
          );
      })
    ) : (
      Object.values(sortedList)[0].tasks.map(task => (
        <TaskListItem
          key={task.id}
          task={task}
          showGroup={true}
          dashboard={true}
        />
      ))
    )}
  </div>
);

const mapStateToProps = ({ tasks, filters }) => ({
  sortedList: getSortedTasks(tasks, filters),
  grouped: filters.grouped
});

export default connect(mapStateToProps)(TaskList);
