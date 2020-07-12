import React, { useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
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
    <div className="list-item">
      <div
        className={
          visible
            ? 'list-item__header list-item__header--visible'
            : 'list-item__header'
        }
      >
        <input
          type="checkbox"
          checked={completed}
          onChange={toggleCompleted}
          disabled={!(dashboard || userInvolved)}
        />

        <div className="list-item__toggle" onClick={toggleVisibility}>
          <h3 className="list-item__title">{title}</h3>
          {deadline && (
            <h3 className="list-item__deadline">
              {moment(deadline).format('Do MMM YYYY')}
            </h3>
          )}
        </div>
      </div>
      <CSSTransition in={visible} timeout={200} className="list-item__visible">
        <div>
          {showGroup && module && (
            <p className="list-item__group">
              <b>Group:</b> {module}
            </p>
          )}
          <div className="file-manager">
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
              <button
                className="button button--grey button--norm-grey button--right"
                onClick={onDownload}
              >
                Download submissions
              </button>
            )}
          </div>
          {description && (
            <p className="list-item__description">
              <b>Description:</b> {description}
            </p>
          )}
          {!dashboard && (
            <div className="list-item__users">
              <p>
                <b>Users: </b>
              </p>
              {Object.keys(initialComplete)
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
                          className="user-complete-checkbox"
                          type="checkbox"
                          checked={id === uid ? completed : initialComplete[id]}
                          htmlFor={id}
                          disabled={true}
                        />
                        <label
                          className="user-complete-checkbox__label"
                          id={id}
                          data-content={
                            users.find(user => user.uid === id).displayName
                          }
                        >
                          {users.find(user => user.uid === id).displayName}
                        </label>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
          {(admin || !gid) && (
            <button
              className="button button--norm-grey button--grey"
              onClick={openEditTask}
            >
              Edit Task
            </button>
          )}
          {(admin || !gid) && (
            <button
              className="button button--norm-grey button--grey"
              onClick={onRemove}
            >
              Remove Task
            </button>
          )}
        </div>
      </CSSTransition>{' '}
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
