import React, { useState } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import {
  startRemovePersonalTask,
  startToggleCompletedPersonal
} from '../actions/tasks';
import EditTaskModal from './EditTaskModal';

export const TaskListItem = ({
  task,
  startRemovePersonalTask,
  startToggleCompletedPersonal,
  showGroup
}) => {
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
  const [open, setOpen] = useState(false);
  const now = moment().valueOf;
  const deadlineClass = deadline > now ? 'before-deadline' : 'after-deadline';

  const toggleVisibility = () => setVisible(!visible);

  const toggleCompleted = () => {
    setCompleted(!completed);
    startToggleCompletedPersonal(id, completed);
  };

  const onRemove = e => {
    e.stopPropagation();
    startRemovePersonalTask(id);
  };

  const openEditTask = e => {
    e.stopPropagation();
    setOpen(true);
  };

  const onRequestClose = () => setOpen(false);

  return (
    <div>
      <input type="checkbox" checked={completed} onChange={toggleCompleted} />
      <p>{completed ? 'completed' : 'not completed'}</p>
      <div onClick={toggleVisibility}>
        <h3>{title}</h3>
        {deadline && (
          <h3 className={deadlineClass}>
            {moment(deadline).format('Do MMM YYYY')}
          </h3>
        )}
        {visible && (
          <div>
            {showGroup && module && <h5>{module}</h5>}
            {description && <p>{description}</p>}
            {!gid && <button onClick={openEditTask}>Edit Task</button>}
            {!gid && <button onClick={onRemove}>Remove Task</button>}
          </div>
        )}
      </div>
      <EditTaskModal
        isOpen={open}
        onRequestClose={onRequestClose}
        task={task}
      />
    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  startRemovePersonalTask: id => dispatch(startRemovePersonalTask(id)),
  startToggleCompletedPersonal: (id, completedState) =>
    dispatch(startToggleCompletedPersonal(id, completedState))
});

export default connect(undefined, mapDispatchToProps)(TaskListItem);
