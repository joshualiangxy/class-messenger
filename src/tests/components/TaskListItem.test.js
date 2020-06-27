import React from 'react';
import { shallow } from 'enzyme';
import { TaskListItem } from '../../components/TaskListItem';
import tasks from '../fixtures/tasks';

let wrapper;
const startRemovePersonalTask = jest.fn();
const startRemoveGroupTask = jest.fn(() => Promise.resolve());
const removeGroupTask = jest.fn();
const startToggleCompletedPersonal = jest.fn();
const startToggleCompletedGroup = jest.fn(() => Promise.resolve());
const task = tasks[0];
const id = task.id;
const completed = task.completed;

beforeEach(() => {
  wrapper = shallow(
    <TaskListItem
      task={task}
      startRemovePersonalTask={startRemovePersonalTask}
      startRemoveGroupTask={startRemoveGroupTask}
      removeGroupTask={removeGroupTask}
      startToggleCompletedPersonal={startToggleCompletedPersonal}
      startToggleCompletedGroup={startToggleCompletedGroup}
      showGroup={false}
      dashboard={true}
    />
  );
});

describe('render', () => {
  it('should render TaskListItem', () => expect(wrapper).toMatchSnapshot());

  it('should render TaskListItem with alt task', () => {
    wrapper.setProps({ task: tasks[1] });

    expect(wrapper).toMatchSnapshot();
  });
});

describe('completed checkbox', () => {
  it('should toggle completed state on change', () => {
    expect(wrapper.find('input').prop('checked')).toBe(completed);

    wrapper.find('input').prop('onChange')();

    expect(wrapper.find('input').prop('checked')).toBe(!completed);

    expect(startToggleCompletedPersonal).toHaveBeenCalledTimes(1);
    expect(startToggleCompletedPersonal).toHaveBeenLastCalledWith(
      id,
      completed
    );
  });
});

describe('clickable div', () => {
  it('should toggle visibility of div', () => {
    wrapper.find('div').at(1).prop('onClick')();

    expect(wrapper).toMatchSnapshot();
  });
});

describe('edit task button', () => {
  it('should open EditTaskModal on click', () => {
    wrapper.find('div').at(1).prop('onClick')();

    expect(wrapper.find('Connect(EditTaskModal)').prop('isOpen')).toBe(false);

    wrapper.find('button').at(0).prop('onClick')({ stopPropagation: () => {} });

    expect(wrapper.find('Connect(EditTaskModal)').prop('isOpen')).toBe(true);
  });
});

describe('remove task button', () => {
  it('should call startRemovePersonalTask on click', () => {
    wrapper.find('div').at(1).prop('onClick')();

    wrapper.find('button').at(1).prop('onClick')({ stopPropagation: () => {} });

    expect(startRemovePersonalTask).toHaveBeenCalledTimes(1);
    expect(startRemovePersonalTask).toHaveBeenLastCalledWith(id);
  });
});
