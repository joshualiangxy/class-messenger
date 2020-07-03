import React from 'react';
import { shallow } from 'enzyme';
import moment from 'moment';
import TaskForm from '../../components/TaskForm';
import tasks, { groupTasks } from '../fixtures/tasks';
import users from '../fixtures/groupUsers';

const onRequestClose = jest.fn();
const submitTask = jest.fn();
const task = tasks[0];
const groupTask = groupTasks[0];
const gid = groupTask.gid;
const groupModule = groupTask.module;
let wrapper;

beforeEach(() => {
  wrapper = shallow(
    <TaskForm
      onRequestClose={onRequestClose}
      task={task}
      submitTask={submitTask}
    />
  );
  onRequestClose.mockClear();
  submitTask.mockClear();
});

describe('render', () => {
  it('should render TaskForm for adding', () => {
    wrapper = shallow(
      <TaskForm onRequestClose={onRequestClose} submitTask={submitTask} />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should render TaskForm with task for editing', () =>
    expect(wrapper).toMatchSnapshot());

  it('should render TaskForm for adding group task', () => {
    wrapper = shallow(
      <TaskForm
        onRequestClose={onRequestClose}
        submitTask={submitTask}
        gid={gid}
        groupModule={groupModule}
        users={users}
      />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should render TaskForm with task for editing group task', () => {
    wrapper = shallow(
      <TaskForm
        onRequestClose={onRequestClose}
        submitTask={submitTask}
        gid={gid}
        groupModule={groupModule}
        users={users}
        task={groupTask}
      />
    );

    expect(wrapper).toMatchSnapshot();
  });
});

describe('title input', () => {
  it('should set title on input change', () => {
    const value = 'Finish problem set';

    expect(wrapper.find('input').at(0).prop('value')).toBe(task.title);

    wrapper.find('input').at(0).prop('onChange')({ target: { value } });

    expect(wrapper.find('input').at(0).prop('value')).toBe(value);
  });
});

describe('module input', () => {
  it('should set module on input change', () => {
    const value = 'CS2040S';

    expect(wrapper.find('input').at(1).prop('value')).toBe(task.module);

    wrapper.find('input').at(1).prop('onChange')({ target: { value } });

    expect(wrapper.find('input').at(1).prop('value')).toBe(value);
  });
});

describe('deadline input', () => {
  it('should set new deadline on deadline change', () => {
    const deadline = moment(0);

    expect(wrapper.find('withStyles(SingleDatePicker)').prop('date')).toEqual(
      moment(task.deadline)
    );

    wrapper.find('withStyles(SingleDatePicker)').prop('onDateChange')(deadline);

    expect(wrapper.find('withStyles(SingleDatePicker)').prop('date')).toBe(
      deadline
    );
  });

  it('should set calendar focus on change', () => {
    expect(wrapper.find('withStyles(SingleDatePicker)').prop('focused')).toBe(
      false
    );

    wrapper.find('withStyles(SingleDatePicker)').prop('onFocusChange')({
      focused: true
    });

    expect(wrapper.find('withStyles(SingleDatePicker)').prop('focused')).toBe(
      true
    );

    wrapper.find('withStyles(SingleDatePicker)').prop('onFocusChange')({
      focused: false
    });

    expect(wrapper.find('withStyles(SingleDatePicker)').prop('focused')).toBe(
      false
    );
  });
});

describe('description input', () => {
  it('should set description on input change', () => {
    const value = 'Finish ASAP';

    expect(wrapper.find('textarea').prop('value')).toBe(task.description);

    wrapper.find('textarea').prop('onChange')({ target: { value } });

    expect(wrapper.find('textarea').prop('value')).toBe(value);
  });
});

describe('cancel button', () => {
  it('should remove errors after call', () => {
    const value = 'Do homework';

    wrapper = shallow(
      <TaskForm onRequestClose={onRequestClose} submitTask={submitTask} />
    );

    wrapper.find('form').prop('onSubmit')({ preventDefault: () => {} });

    expect(wrapper).toMatchSnapshot();

    wrapper.find('input').at(0).prop('onChange')({ target: { value } });
    wrapper.find('form').prop('onSubmit')({ preventDefault: () => {} });

    expect(wrapper).toMatchSnapshot();
  });

  it('should reset fields to original value after call', () => {
    wrapper = shallow(
      <TaskForm
        onRequestClose={onRequestClose}
        submitTask={submitTask}
        gid={gid}
        groupModule={groupModule}
        users={users}
        task={groupTask}
      />
    );

    const title = 'Do problem set';
    const description = 'Finish ASAP';
    const deadline = moment(0);
    const namingConvention = 'problem_set';

    wrapper.find('input').at(0).prop('onChange')({ target: { value: title } });
    wrapper.find('textarea').prop('onChange')({
      target: { value: description }
    });
    wrapper.find('withStyles(SingleDatePicker)').prop('onDateChange')(deadline);
    wrapper.find('SelectUserModal').prop('removeUser')(users[0].uid);
    wrapper.find('SelectUserModal').prop('addUser')(users[1].uid);
    wrapper.find('input').at(2).prop('onChange')();
    wrapper.find('input').at(3).prop('onChange')({
      target: { value: namingConvention }
    });

    expect(wrapper.find('input').at(0).prop('value')).toBe(title);
    expect(wrapper.find('textarea').prop('value')).toBe(description);
    expect(wrapper.find('withStyles(SingleDatePicker)').prop('date')).toBe(
      deadline
    );
    expect(
      wrapper.find('SelectUserModal').prop('groupCompletedState')
    ).toEqual({ [users[1].uid]: false });
    expect(wrapper.find('input').at(2).prop('checked')).toBe(true);
    expect(wrapper.find('input').at(3).prop('value')).toBe(namingConvention);

    wrapper.find('button').at(2).prop('onClick')();

    expect(wrapper.find('input').at(0).prop('value')).toBe(groupTask.title);
    expect(wrapper.find('textarea').prop('value')).toBe(groupTask.description);
    expect(wrapper.find('withStyles(SingleDatePicker)').prop('date')).toEqual(
      null
    );
    expect(wrapper.find('SelectUserModal').prop('groupCompletedState')).toEqual(
      {
        [users[0].uid]: false
      }
    );
    expect(wrapper.find('input').at(2).prop('checked')).toBe(false);

    wrapper.find('input').at(2).prop('onChange')();

    expect(wrapper.find('input').at(3).prop('value')).toBe('');
  });

  it('should call onRequestClose on button click', () => {
    wrapper.find('button').at(1).prop('onClick')();

    expect(onRequestClose).toHaveBeenCalledTimes(1);
  });
});

describe('submit task', () => {
  const submitEvent = { preventDefault: () => {} };

  it('should render error on submit if title input is empty', () => {
    const value = '';

    expect(wrapper).toMatchSnapshot();

    wrapper.find('input').at(0).prop('onChange')({ target: { value } });
    wrapper.find('form').prop('onSubmit')(submitEvent);

    expect(wrapper).toMatchSnapshot();
  });

  it('should render error on submit if title input is empty after trimming', () => {
    const value = '            ';

    expect(wrapper).toMatchSnapshot();

    wrapper.find('input').at(0).prop('onChange')({ target: { value } });
    wrapper.find('form').prop('onSubmit')(submitEvent);

    expect(wrapper).toMatchSnapshot();
  });

  it('should render error on submit if naming convention is empty when enabled', () => {
    wrapper = shallow(
      <TaskForm
        onRequestClose={onRequestClose}
        submitTask={submitTask}
        gid={gid}
        groupModule={groupModule}
        users={users}
        task={groupTask}
      />
    );

    wrapper.find('input').at(2).prop('onChange')();
    wrapper.find('form').prop('onSubmit')(submitEvent);

    expect(wrapper.find('input').at(3).prop('value')).toBe('');
    expect(wrapper).toMatchSnapshot();
  });

  it('should remove error after valid submission', () => {
    wrapper.find('input').at(0).prop('onChange')({ target: { value: '' } });
    wrapper.find('form').prop('onSubmit')(submitEvent);

    expect(wrapper).toMatchSnapshot();

    wrapper.find('input').at(0).prop('onChange')({
      target: { value: 'Watch lecture' }
    });
    wrapper.find('form').prop('onSubmit')(submitEvent);

    expect(wrapper).toMatchSnapshot();
  });

  it('should call submitTask on valid submission', () => {
    wrapper.find('form').prop('onSubmit')(submitEvent);

    expect(submitTask).toHaveBeenCalledTimes(1);
    expect(submitTask).toHaveBeenLastCalledWith(task);
  });

  it('should submit task with title, description and module trimmed', () => {
    const title = '         Do problem set';
    const trimmedTitle = 'Do problem set';
    const module = '        CS2040S        ';
    const trimmedModule = 'CS2040S';
    const description = 'Finish ASAP          ';
    const trimmedDescription = 'Finish ASAP';

    wrapper.find('input').at(0).prop('onChange')({ target: { value: title } });
    wrapper.find('input').at(1).prop('onChange')({ target: { value: module } });
    wrapper.find('textarea').prop('onChange')({
      target: { value: description }
    });
    wrapper.find('form').prop('onSubmit')(submitEvent);

    expect(submitTask).toHaveBeenCalledTimes(1);
    expect(submitTask).toHaveBeenLastCalledWith({
      ...task,
      title: trimmedTitle,
      module: trimmedModule,
      description: trimmedDescription
    });
  });

  it('should submit task without deadline field if deadline is null', () => {
    const { deadline, ...newTask } = task;

    wrapper.find('withStyles(SingleDatePicker)').prop('onDateChange')(null);
    wrapper.find('form').prop('onSubmit')(submitEvent);

    expect(submitTask).toHaveBeenCalledTimes(1);
    expect(submitTask).toHaveBeenLastCalledWith(newTask);
  });

  it('should submit group task without uploadRequired and namingConvention field if uploadRequired is false', () => {
    const { uploadRequired, downloadURLs, ...rest } = groupTask;
    wrapper = shallow(
      <TaskForm
        onRequestClose={onRequestClose}
        submitTask={submitTask}
        gid={gid}
        groupModule={groupModule}
        users={users}
        task={groupTask}
      />
    );

    wrapper.find('input').at(2).prop('onChange')();
    wrapper.find('input').at(3).prop('onChange')({
      target: { value: 'nameConvention' }
    });
    wrapper.find('input').at(1).prop('onChange')();

    wrapper.find('form').prop('onSubmit')(submitEvent);

    expect(submitTask).toHaveBeenCalledTimes(1);
    expect(submitTask).toHaveBeenLastCalledWith(rest);
  });
});

describe('SelectUserModal', () => {
  beforeEach(() => {
    wrapper = shallow(
      <TaskForm
        onRequestClose={onRequestClose}
        submitTask={submitTask}
        gid={gid}
        groupModule={groupModule}
        users={users}
        task={groupTask}
      />
    );
  });

  it('should open modal on button click', () => {
    expect(wrapper.find('SelectUserModal').prop('isOpen')).toBe(false);

    wrapper.find('button').at(0).prop('onClick')();

    expect(wrapper.find('SelectUserModal').prop('isOpen')).toBe(true);
  });

  it('should close modal after calling onRequestClose', () => {
    wrapper.find('button').at(0).prop('onClick')();

    expect(wrapper.find('SelectUserModal').prop('isOpen')).toBe(true);

    wrapper.find('SelectUserModal').prop('onRequestClose')();

    expect(wrapper.find('SelectUserModal').prop('isOpen')).toBe(false);
  });

  it('should add users to the completedState', () => {
    expect(
      wrapper.find('SelectUserModal').prop('groupCompletedState')
    ).toEqual({ [users[0].uid]: false });

    wrapper.find('SelectUserModal').prop('addUser')(users[1].uid);

    expect(
      wrapper.find('SelectUserModal').prop('groupCompletedState')
    ).toEqual({ [users[0].uid]: false, [users[1].uid]: false });
  });

  it('should remove users to the completedState', () => {
    expect(
      wrapper.find('SelectUserModal').prop('groupCompletedState')
    ).toEqual({ [users[0].uid]: false });

    wrapper.find('SelectUserModal').prop('removeUser')(users[0].uid);

    expect(wrapper.find('SelectUserModal').prop('groupCompletedState')).toEqual(
      {}
    );
  });
});

describe('upload requirement', () => {
  beforeEach(() => {
    wrapper = shallow(
      <TaskForm
        onRequestClose={onRequestClose}
        submitTask={submitTask}
        gid={gid}
        groupModule={groupModule}
        users={users}
        task={groupTask}
      />
    );
  });

  it('should render enable naming convention checkbox if upload required', () =>
    expect(wrapper).toMatchSnapshot());

  it('should not render enable naming convention checkbox if upload not required', () => {
    wrapper.find('input').at(1).prop('onChange')();

    expect(wrapper).toMatchSnapshot();
  });
});

describe('naming convention', () => {
  const value = 'namingConvention';

  beforeEach(() => {
    wrapper = shallow(
      <TaskForm
        onRequestClose={onRequestClose}
        submitTask={submitTask}
        gid={gid}
        groupModule={groupModule}
        users={users}
        task={groupTask}
      />
    );
  });

  it('should render naming convention text input if enabled', () => {
    wrapper.find('input').at(2).prop('onChange')();

    expect(wrapper).toMatchSnapshot();
  });

  it('should not render naming convention text input if not enabled', () =>
    expect(wrapper).toMatchSnapshot());

  it('should set naming convention on text input change', () => {
    wrapper.find('input').at(2).prop('onChange')();
    wrapper.find('input').at(3).prop('onChange')({ target: { value } });

    expect(wrapper.find('input').at(3).prop('value')).toBe(value);
  });

  it('should reset naming convention if checkbox is toggled', () => {
    wrapper.find('input').at(2).prop('onChange')();
    wrapper.find('input').at(3).prop('onChange')({ target: { value } });

    wrapper.find('input').at(2).prop('onChange')();
    wrapper.find('input').at(2).prop('onChange')();

    expect(wrapper.find('input').at(3).prop('value')).toBe('');

    wrapper.find('input').at(3).prop('onChange')({ target: { value } });

    wrapper.find('input').at(1).prop('onChange')();
    wrapper.find('input').at(1).prop('onChange')();

    expect(wrapper.find('input').at(2).prop('checked')).toBe(false);

    wrapper.find('input').at(2).prop('onChange')();

    expect(wrapper.find('input').at(3).prop('value')).toBe('');
  });
});
