import React from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { startAddPersonalTask, startAddGroupTask } from '../actions/tasks';
import TaskForm from './TaskForm';

export const AddTaskModal = ({
  startAddPersonalTask,
  startAddGroupTask,
  isOpen,
  onRequestClose,
  gid,
  groupModule,
  addGroupTask
}) => {
  const submitTask = task =>
    gid
      ? startAddGroupTask(task).then(() => {
          addGroupTask(task);
          onRequestClose();
        })
      : startAddPersonalTask(task).then(() => onRequestClose());

  return (
    <Modal
      isOpen={isOpen}
      contentLabel="Add Task"
      onRequestClose={onRequestClose}
      appElement={document.getElementById('root')}
    >
      <h2>Add Task</h2>
      <TaskForm
        gid={gid}
        groupModule={groupModule}
        submitTask={submitTask}
        onRequestClose={onRequestClose}
      />
    </Modal>
  );
};

const mapDispatchToProps = dispatch => ({
  startAddPersonalTask: task => dispatch(startAddPersonalTask(task)),
  startAddGroupTask: task => dispatch(startAddGroupTask(task))
});

export default connect(undefined, mapDispatchToProps)(AddTaskModal);
