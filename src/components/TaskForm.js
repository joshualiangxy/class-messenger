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
      : false,
    namingConvention: initialNamingConvention = '',
    uploadRequired: initialUploadRequired = false,
    downloadURLs = {}
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
  const [uploadRequired, setUploadRequired] = useState(initialUploadRequired);
  const [enforceNamingConvention, setEnforceNamingConvention] = useState(
    initialNamingConvention ? true : false
  );
  const [namingConvention, setNamingConvention] = useState(
    initialNamingConvention
  );
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

  const toggleUploadRequired = () => {
    if (uploadRequired) {
      setNamingConvention('');
      setEnforceNamingConvention(false);
    }
    setUploadRequired(!uploadRequired);
  };

  const toggleEnforceNamingConvention = () => {
    if (enforceNamingConvention) setNamingConvention('');
    setEnforceNamingConvention(!enforceNamingConvention);
  };

  const onNamingConventionChange = e => {
    const namingConvention = e.target.value;
    setNamingConvention(namingConvention);
  };

  const onSubmit = e => {
    e.preventDefault();

    const submittedTitle = title.trim();
    const submittedDescription = description.trim();
    const submittedModule = module.trim();
    const submittedNamingConvention = namingConvention.trim();
    if (!submittedTitle) setError('Please provide title of task');
    else if (enforceNamingConvention && !submittedNamingConvention)
      setError('Naming convention cannot be empty');
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
      if (uploadRequired) {
        const usersInvolved = Object.keys(groupCompletedState);

        task.uploadRequired = true;
        task.downloadURLs = {};
        usersInvolved.forEach(uid => {
          if (downloadURLs.hasOwnProperty(uid))
            task.downloadURLs[uid] = downloadURLs[uid];
        });
      }
      if (enforceNamingConvention)
        task.namingConvention = submittedNamingConvention;
      submitTask(task);
    }
  };

  const onCancel = () => {
    setTitle(initialTitle);
    setModule(gid ? groupModule : initialModule);
    setDescription(initialDescription);
    setDeadline(initialDeadline ? moment(initialDeadline) : null);
    setCalendarFocus(false);
    setUploadRequired(initialUploadRequired);
    setEnforceNamingConvention(false);
    setNamingConvention('');
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
          <input
            type="checkbox"
            id="uploadRequired"
            checked={uploadRequired}
            onChange={toggleUploadRequired}
          />
          <label htmlFor="uploadRequired">Require submission</label>
          {uploadRequired && (
            <div>
              <input
                type="checkbox"
                id="namingConvention"
                checked={enforceNamingConvention}
                onChange={toggleEnforceNamingConvention}
              />
              <label htmlFor="namingConvention">
                Enforce naming convention
              </label>
              {enforceNamingConvention && (
                <input
                  type="text"
                  value={namingConvention}
                  onChange={onNamingConventionChange}
                  placeholder="Naming convention"
                />
              )}
            </div>
          )}
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
