import React from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { startAddPersonalTask } from '../actions/tasks';
import TaskForm from './TaskForm';

export const AddTaskModal = ({
  startAddPersonalTask,
  isOpen,
  onRequestClose,
  isGroup,
  groupModule
}) => {
  const submitTask = task => {
    startAddPersonalTask(task).then(() => onRequestClose());
  };

  return (
    <Modal
      isOpen={isOpen}
      contentLabel="Add Task"
      onRequestClose={onRequestClose}
      appElement={document.getElementById('root')}
    >
      <h2>Add Task</h2>
      <TaskForm
        isGroup={isGroup}
        groupModule={groupModule}
        submitTask={submitTask}
        onRequestClose={onRequestClose}
      />
    </Modal>
  );
};

const mapDispatchToProps = dispatch => ({
  startAddPersonalTask: task => dispatch(startAddPersonalTask(task))
});

export default connect(undefined, mapDispatchToProps)(AddTaskModal);
