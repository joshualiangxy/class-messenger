import React, { useState } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { startRemovePersonalTask } from '../actions/tasks';

export const TaskListItem = ({ task }) => {
  const {
    id,
    title,
    description,
    module,
    deadline,
    completed: initialComplete,
    gid
  } = task;
  const [visible, setVisible] = useState(false);
  const [completed, setCompleted] = useState(initialComplete);
  const now = moment().valueOf;
  const deadlineClass =
    deadline - now > 0 ? 'before-deadline' : 'after-deadline';

  const toggleVisibility = () => setVisible(!visible);
  const toggleCompleted = () => setCompleted(!completed);

  return (
    <div>
      <input type="checkbox" checked={completed} onChange={toggleCompleted} />
      <div onClick={toggleVisibility}>
        <h3>{title}</h3>
        {deadline && (
          <h3 className={deadlineClass}>
            {moment(deadline).format('Do MMM YYYY')}
          </h3>
        )}
        {visible && (
          <div>
            {module && <h5>{module}</h5>}
            {description && <p>{description}</p>}
            {gid && (
              <button onClick={() => startRemovePersonalTask(id)}>
                Remove Task
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  startRemovePersonalTask: id => dispatch(startRemovePersonalTask(id))
});

export default connect(undefined, mapDispatchToProps)(TaskListItem);
