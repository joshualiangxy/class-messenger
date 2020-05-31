import React, { useState } from 'react';
import moment from 'moment';
import { SingleDatePicker } from 'react-dates';

export const TaskForm = ({ isGroup, task, submitTask, groupModule }) => {
  const {
    initialTitle = '',
    initialDescription = '',
    initialModule = '',
    initialDeadline
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
    const module = e.target.value;
    setModule(module);
  };

  const onDeadlineChange = deadline => setDeadline(deadline);

  const onFocusChange = ({ calendarFocused }) =>
    setCalendarFocus(calendarFocused);

  const onSubmit = e => {
    e.preventDefault();

    if (!title) setError('Please provide title of task');
    else {
      setError('');
      submitTask({
        title,
        description,
        module,
        deadline: deadline ? deadline.valueOf() : undefined
      });
    }
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
      {isGroup && (
        <input
          type="text"
          placeholder="Module code, class name (optional)"
          value={module}
          onChange={onModuleChange}
        />
      )}
      <SingleDatePicker
        date={deadline}
        onDateChange={onDeadlineChange}
        focused={calendarFocused}
        onFocusChange={onFocusChange}
        numberOfMonths={1}
        isOutsideRange={() => false}
        showClearDate={true}
      />
      <textarea
        placeholder="Add a description for your task (optional)"
        value={description}
        onChange={onDescriptionChange}
      />
      <button>{task ? 'Edit Task' : 'Add Task'}</button>
    </form>
  );
};
