import React, { useState } from 'react';
import moment from 'moment';
import { SingleDatePicker } from 'react-dates';
import { v4 as uuid } from 'uuid';

const TaskForm = ({
  isGroup,
  task = {},
  submitTask,
  groupModule,
  onRequestClose
}) => {
  const {
    id = uuid(),
    title: initialTitle = '',
    description: initialDescription = '',
    module: initialModule = '',
    deadline: initialDeadline,
    completed: initialComplete = false
  } = task;
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [module, setModule] = useState(isGroup ? groupModule : initialModule);
  const [deadline, setDeadline] = useState(
    initialDeadline ? moment(initialDeadline) : undefined
  );
  const [calendarFocused, setCalendarFocus] = useState(false);
  const [error, setError] = useState('');

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
        completed: initialComplete
      };
      submitTask(
        deadline
          ? {
              ...task,
              deadline: deadline.valueOf()
            }
          : task
      );
    }
  };

  const onCancel = () => {
    setTitle(initialTitle);
    setModule(isGroup ? groupModule : initialModule);
    setDeadline(initialDeadline ? moment(initialDeadline) : undefined);
    setCalendarFocus(false);
    setError('');
    onRequestClose();
  };

  return (
    <form onSubmit={onSubmit}>
      {error && <p>{error}</p>}
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={onTitleChange}
        autoFocus={true}
      />
      {!isGroup && (
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
      <button>{initialTitle ? 'Edit Task' : 'Add Task'}</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
};

export default TaskForm;
