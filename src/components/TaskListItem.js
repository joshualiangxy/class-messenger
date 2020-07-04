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
import FileUploadForm from './FileUploadForm';
import { downloadFile } from '../actions/files';

export const TaskListItem = ({
  removeAdmin,
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
  removeUserFromTask,
  showGroup,
  admin,
  groupName,
  editGroupTask,
  downloadFile
}) => {
  const {
    id,
    title,
    description,
    module,
    deadline,
    completed: initialComplete,
    gid,
    namingConvention,
    uploadRequired
  } = task;
  const [userInvolved, setUserInvolved] = useState(
    initialComplete.hasOwnProperty(uid)
  );
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

  useEffect(() => {
    setUserInvolved(initialComplete.hasOwnProperty(uid));
  }, [initialComplete, uid]);

  const toggleVisibility = () => setVisible(!visible);

  const toggleCompleted = () => {
    if (!(userInvolved || dashboard)) return;

    if (gid) {
      startToggleCompletedGroup(id, gid, completed).then(userInvolved => {
        if (!userInvolved) {
          setUserInvolved(false);
          if (!dashboard) removeUserFromTask(id, uid);
          return;
        }
        if (!dashboard) toggleGroupTaskComplete(id);
      });
    } else startToggleCompletedPersonal(id, completed);
    setCompleted(!completed);
  };

  const onRemove = e => {
    e.stopPropagation();
    gid
      ? startRemoveGroupTask(gid, id).then(isAdmin => {
          if (isAdmin) return removeGroupTask(id);
          else return removeAdmin();
        })
      : startRemovePersonalTask(id);
  };

  const openEditTask = e => {
    e.stopPropagation();
    setOpen(true);
  };

  const onRequestClose = () => setOpen(false);

  const onDownload = e => {
    e.stopPropagation();
    downloadFile(gid, id).then(isAdmin => {
      if (!isAdmin) return removeAdmin();
    });
  };

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
            {userInvolved && uploadRequired && (
              <div>
                <FileUploadForm
                  id={id}
                  gid={gid}
                  namingConvention={namingConvention}
                />
              </div>
            )}
            {uploadRequired && admin && (
              <button onClick={onDownload}>Download submissions</button>
            )}
            {!dashboard &&
              Object.keys(initialComplete)
                .sort((uidOne, uidTwo) => {
                  const userOne = users.find(user => user.uid === uidOne);
                  const userTwo = users.find(user => user.uid === uidTwo);

                  if (!(userOne && userTwo)) return 0;
                  return userOne.displayName.localeCompare(userTwo.displayName);
                })
                .map(id => (
                  <div key={id}>
                    {users.find(user => user.uid === id) && (
                      <div>
                        <input
                          type="checkbox"
                          checked={id === uid ? completed : initialComplete[id]}
                          htmlFor={id}
                          disabled={true}
                        />
                        <label id={id}>
                          {users.find(user => user.uid === id).displayName}
                        </label>
                      </div>
                    )}
                  </div>
                ))}
            {(admin || !gid) && (
              <button onClick={openEditTask}>Edit Task</button>
            )}
            {(admin || !gid) && <button onClick={onRemove}>Remove Task</button>}
          </div>
        )}
      </div>
      <EditTaskModal
        removeAdmin={removeAdmin}
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
    dispatch(startToggleCompletedGroup(id, gid, completedState)),
  downloadFile: (gid, id) => dispatch(downloadFile(gid, id))
});

export default connect(mapStateToProps, mapDispatchToProps)(TaskListItem);
