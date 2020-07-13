import React from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { startEditPersonalTask, startEditGroupTask } from '../actions/tasks';
import TaskForm from './TaskForm';

export const EditTaskModal = ({
  startEditPersonalTask,
  startEditGroupTask,
  removeAdmin,
  isOpen,
  onRequestClose,
  gid,
  groupModule,
  groupName,
  task,
  users,
  editGroupTask
}) => {
  const submitTask = updates =>
    gid
      ? startEditGroupTask(task.id, updates, groupName, task)
          .then(isAdmin => {
            if (isAdmin) return editGroupTask(task.id, updates);
            else return removeAdmin();
          })
          .then(() => onRequestClose())
      : startEditPersonalTask(task.id, updates).then(() => onRequestClose());

  return (
    <Modal
      className="task-modal"
      isOpen={isOpen}
      contentLabel="Edit Task"
      onRequestClose={onRequestClose}
      closeTimeoutMS={200}
      appElement={document.getElementById('root')}
    >
      <h1>Edit Task</h1>
      <TaskForm
        gid={gid}
        groupModule={groupModule}
        users={users}
        submitTask={submitTask}
        onRequestClose={onRequestClose}
        task={task}
      />
    </Modal>
  );
};

const mapDispatchToProps = dispatch => ({
  startEditPersonalTask: (id, updates) =>
    dispatch(startEditPersonalTask(id, updates)),
  startEditGroupTask: (id, updates, groupName, task) =>
    dispatch(startEditGroupTask(id, updates, groupName, task))
});

export default connect(undefined, mapDispatchToProps)(EditTaskModal);
