import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import {
  startRemovePersonalTask,
  startRemoveGroupTask,
  startToggleCompletedPersonal,
  startToggleCompletedGroup
} from '../actions/tasks';
import EditTaskModal from './EditTaskModal';

export const TaskListItem = ({
  uid,
  task,
  users,
  dashboard,
  startRemovePersonalTask,
  startRemoveGroupTask,
  startToggleCompletedPersonal,
  startToggleCompletedGroup,
  removeGroupTask,
  toggleGroupTaskComplete,
  showGroup,
  admin,
  groupName,
  editGroupTask
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
  const userInvolved = initialComplete.hasOwnProperty(uid);
  const [visible, setVisible] = useState(false);
  const [completed, setCompleted] = useState(
    !dashboard ? (userInvolved ? initialComplete[uid] : false) : initialComplete
  );
  const [open, setOpen] = useState(false);
  const now = moment().valueOf;
  const deadlineClass = deadline > now ? 'before-deadline' : 'after-deadline';

  useEffect(() => {
    if (!(dashboard || userInvolved)) setCompleted(false);
  }, [dashboard, userInvolved]);

  const toggleVisibility = () => setVisible(!visible);

  const toggleCompleted = () => {
    setCompleted(!completed);
    if (gid) {
      startToggleCompletedGroup(id, gid, completed);
      toggleGroupTaskComplete(id);
    } else startToggleCompletedPersonal(id, completed);
  };

  const onRemove = e => {
    e.stopPropagation();
    gid
      ? startRemoveGroupTask(gid, id).then(() => removeGroupTask(id))
      : startRemovePersonalTask(id);
  };

  const openEditTask = e => {
    e.stopPropagation();
    setOpen(true);
  };

  const onRequestClose = () => setOpen(false);

  return (
    <div>
      <input
        type="checkbox"
        checked={completed}
        onChange={toggleCompleted}
        disabled={!(dashboard || userInvolved)}
      />
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
            {(admin || !gid) && (
              <button onClick={openEditTask}>Edit Task</button>
            )}
            {(admin || !gid) && <button onClick={onRemove}>Remove Task</button>}
          </div>
        )}
      </div>
      <EditTaskModal
        isOpen={open}
        onRequestClose={onRequestClose}
        gid={gid}
        groupModule={module}
        groupName={groupName}
        task={task}
        users={users}
        editGroupTask={editGroupTask}
      />
    </div>
  );
};

const mapStateToProps = state => ({ uid: state.auth.user.uid });

const mapDispatchToProps = dispatch => ({
  startRemovePersonalTask: id => dispatch(startRemovePersonalTask(id)),
  startRemoveGroupTask: (gid, id) => dispatch(startRemoveGroupTask(gid, id)),
  startToggleCompletedPersonal: (id, completedState) =>
    dispatch(startToggleCompletedPersonal(id, completedState)),
  startToggleCompletedGroup: (id, gid, completedState) =>
    dispatch(startToggleCompletedGroup(id, gid, completedState))
});

export default connect(mapStateToProps, mapDispatchToProps)(TaskListItem);
