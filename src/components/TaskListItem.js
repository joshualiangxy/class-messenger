import React, { useState } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { startRemovePersonalTask } from '../actions/tasks';

export const TaskListItem = ({
  id,
  title,
  description,
  module,
  deadline,
  isGroup
}) => {
  const [visible, setVisible] = useState(false);
  const now = moment();
  const deadlineClass = deadline.isAfter(now)
    ? 'before-deadline'
    : 'after-deadline';

  const toggleVisibility = () => setVisible(!visible);

  return (
    <div onClick={toggleVisibility}>
      <h3>{title}</h3>
      {deadline && (
        <h3 className={deadlineClass}>{deadline.format('Do MMM YYYY')}</h3>
      )}
      {visible && (
        <div>
          {module && <h5>{module}</h5>}
          {description && <p>{description}</p>}
          <button disabled={!!isGroup} onClick={startRemovePersonalTask}>
            Remove Task
          </button>
        </div>
      )}
    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  startRemovePersonalTask: () => dispatch(startRemovePersonalTask(id))
});

export default connect(undefined, mapDispatchToProps)(TaskListItem);
