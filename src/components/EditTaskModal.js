import React from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import {
  startEditPersonalTask,
  startEditGroupTask,
  startSetTasks
} from '../actions/tasks';
import TaskForm from './TaskForm';

export const EditTaskModal = ({
  startEditPersonalTask,
  startEditGroupTask,
  startSetTasks,
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
      ? startEditGroupTask(task.id, updates, groupName).then(() => {
          editGroupTask(task.id, updates);
          startSetTasks(); // Temporary solution
          onRequestClose();
        })
      : startEditPersonalTask(task.id, updates).then(() => onRequestClose());

  return (
    <Modal
      isOpen={isOpen}
      contentLabel="Edit Task"
      onRequestClose={onRequestClose}
      appElement={document.getElementById('root')}
    >
      <h2>Edit Task</h2>
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
  startEditGroupTask: (id, updates, groupName) =>
    dispatch(startEditGroupTask(id, updates, groupName)),
  startSetTasks: () => dispatch(startSetTasks())
});

export default connect(undefined, mapDispatchToProps)(EditTaskModal);
