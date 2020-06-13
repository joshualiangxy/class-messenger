import React from 'react';
import { shallow } from 'enzyme';
import moment from 'moment';
import TaskForm from '../../components/TaskForm';
import tasks from '../fixtures/tasks';

const onRequestClose = jest.fn();
const submitTask = jest.fn();
const task = tasks[0];
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
    const title = 'Do problem set';
    const module = 'CS2040S';
    const description = 'Finish ASAP';
    const deadline = moment(0);

    wrapper.find('input').at(0).prop('onChange')({ target: { value: title } });
    wrapper.find('input').at(1).prop('onChange')({ target: { value: module } });
    wrapper.find('textarea').prop('onChange')({
      target: { value: description }
    });
    wrapper.find('withStyles(SingleDatePicker)').prop('onDateChange')(deadline);

    expect(wrapper.find('input').at(0).prop('value')).toBe(title);
    expect(wrapper.find('input').at(1).prop('value')).toBe(module);
    expect(wrapper.find('textarea').prop('value')).toBe(description);
    expect(wrapper.find('withStyles(SingleDatePicker)').prop('date')).toBe(
      deadline
    );

    wrapper.find('button').at(1).prop('onClick')();

    expect(wrapper.find('input').at(0).prop('value')).toBe(task.title);
    expect(wrapper.find('input').at(1).prop('value')).toBe(task.module);
    expect(wrapper.find('textarea').prop('value')).toBe(task.description);
    expect(wrapper.find('withStyles(SingleDatePicker)').prop('date')).toEqual(
      moment(task.deadline)
    );
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
});
