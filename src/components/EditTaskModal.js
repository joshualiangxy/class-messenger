import React from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { startEditPersonalTask } from '../actions/tasks';
import TaskForm from './TaskForm';

export const EditTaskModal = ({
  startEditPersonalTask,
  isOpen,
  onRequestClose,
  isGroup,
  groupModule,
  task
}) => {
  const submitTask = task => {
    const id = task.id;
    startEditPersonalTask(id, task).then(() => onRequestClose());
  };

  return (
    <Modal
      isOpen={isOpen}
      contentLabel="Edit Task"
      onRequestClose={onRequestClose}
      appElement={document.getElementById('root')}
    >
      <h2>Edit Task</h2>
      <TaskForm
        isGroup={isGroup}
        groupModule={groupModule}
        submitTask={submitTask}
        onRequestClose={onRequestClose}
        task={task}
      />
    </Modal>
  );
};

const mapDispatchToProps = dispatch => ({
  startEditPersonalTask: (id, task) => dispatch(startEditPersonalTask(id, task))
});

export default connect(undefined, mapDispatchToProps)(EditTaskModal);
