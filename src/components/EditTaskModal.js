import React from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { startEditPersonalTask, startEditGroupTask } from '../actions/tasks';
import TaskForm from './TaskForm';

export const EditTaskModal = ({
  startEditPersonalTask,
  startEditGroupTask,
  isOpen,
  onRequestClose,
  gid,
  groupModule,
  task,
  editGroupTask
}) => {
  const submitTask = updates =>
    gid
      ? startEditGroupTask(task.id, updates).then(() => {
          editGroupTask(task.id, updates);
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
  startEditGroupTask: (id, updates) => dispatch(startEditGroupTask(id, updates))
});

export default connect(undefined, mapDispatchToProps)(EditTaskModal);
