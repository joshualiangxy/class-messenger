import React, { useState } from 'react';
import moment from 'moment';
import { SingleDatePicker } from 'react-dates';
import { v4 as uuid } from 'uuid';
import SelectUserModal from './SelectUserModal';

const TaskForm = ({
  gid,
  users,
  groupModule,
  task = {},
  submitTask,
  onRequestClose
}) => {
  const {
    id = uuid(),
    title: initialTitle = '',
    description: initialDescription = '',
    module: initialModule = '',
    deadline: initialDeadline,
    completed = gid
      ? users.reduce((obj, user) => {
          obj[user.uid] = false;

          return obj;
        }, {})
      : false
  } = task;
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [module, setModule] = useState(gid ? groupModule : initialModule);
  const [deadline, setDeadline] = useState(
    initialDeadline ? moment(initialDeadline) : null
  );
  const [groupCompletedState, setGroupCompletedState] = useState(completed);
  const [calendarFocused, setCalendarFocus] = useState(false);
  const [error, setError] = useState('');

  const openSelectUserModal = () => setOpen(true);

  const closeSelectUserModal = () => setOpen(false);

  const onTitleChange = e => {
    const title = e.target.value;
    setTitle(title);
  };

  const onDescriptionChange = e => {
    const description = e.target.value;
    setDescription(description);
  };

  const onModuleChange = e => {
    const module = e.target.value.toUpperCase();
    setModule(module);
  };

  const onDeadlineChange = deadline => setDeadline(deadline);

  const onFocusChange = ({ focused }) => {
    setCalendarFocus(focused);
  };

  const addUser = uid =>
    setGroupCompletedState({
      ...groupCompletedState,
      [uid]: false
    });

  const removeUser = uid => {
    const { [uid]: omit, ...rest } = groupCompletedState;
    setGroupCompletedState(rest);
  };

  const onSubmit = e => {
    e.preventDefault();

    const submittedTitle = title.trim();
    const submittedDescription = description.trim();
    const submittedModule = module.trim();
    if (!submittedTitle) setError('Please provide title of task');
    else {
      setError('');
      const task = {
        id,
        title: submittedTitle,
        description: submittedDescription,
        module: submittedModule,
        completed: gid ? groupCompletedState : completed
      };
      if (gid) task.gid = gid;
      if (deadline) task.deadline = deadline.valueOf();
      submitTask(task);
    }
  };

  const onCancel = () => {
    setTitle(initialTitle);
    setModule(gid ? groupModule : initialModule);
    setDescription(initialDescription);
    setDeadline(initialDeadline ? moment(initialDeadline) : null);
    setCalendarFocus(false);
    setError('');
    onRequestClose();
  };

  return (
    <form onSubmit={onSubmit}>
      {error && <p>{error}</p>}
      <input
        type="text"
        placeholder="Title (required)"
        value={title}
        onChange={onTitleChange}
        autoFocus={true}
      />
      {!gid && (
        <input
          type="text"
          placeholder="Module code/Class name (optional)"
          value={module}
          onChange={onModuleChange}
        />
      )}
      <SingleDatePicker
        id="taskDeadline"
        date={deadline}
        onDateChange={onDeadlineChange}
        focused={calendarFocused}
        onFocusChange={onFocusChange}
        numberOfMonths={1}
        isOutsideRange={() => false}
        displayFormat="DD/MM/YYYY"
        showClearDate={true}
        placeholder="Deadline"
      />
      <textarea
        placeholder="Add a description for your task (optional)"
        value={description}
        onChange={onDescriptionChange}
      />
      {gid && (
        <div>
          <SelectUserModal
            users={users}
            groupCompletedState={groupCompletedState}
            removeUser={removeUser}
            addUser={addUser}
            isOpen={open}
            onRequestClose={closeSelectUserModal}
          />
          <button type="button" onClick={openSelectUserModal}>
            Select users
          </button>
        </div>
      )}
      <button>{initialTitle ? 'Edit Task' : 'Add Task'}</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
};

export default TaskForm;
