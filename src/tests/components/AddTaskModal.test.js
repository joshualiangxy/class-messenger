import React from 'react';
import { shallow } from 'enzyme';
import tasks, { groupTasks } from '../fixtures/tasks';
import users from '../fixtures/groupUsers';
import { AddTaskModal } from '../../components/AddTaskModal';

let wrapper;
const startAddPersonalTask = jest.fn(() => Promise.resolve());
const startAddGroupTask = jest.fn(() => Promise.resolve());
const onRequestClose = jest.fn();
const addGroupTask = jest.fn();
const gid = 'testgid';
const groupModule = 'CS1231S';
const groupName = 'Tutorial 21';

beforeEach(() => {
  jest.clearAllMocks();

  wrapper = shallow(
    <AddTaskModal
      startAddPersonalTask={startAddPersonalTask}
      startAddGroupTask={startAddGroupTask}
      onRequestClose={onRequestClose}
      isOpen={true}
      addGroupTask={addGroupTask}
    />
  );
});

describe('render', () => {
  it('should render AddTaskModal', () => expect(wrapper).toMatchSnapshot());

  it('should render AddTaskModal for group', () => {
    wrapper.setProps({ gid, groupModule, groupName, users });
    expect(wrapper).toMatchSnapshot();
  });
});

describe('submit task', () => {
  it('should handle submitTask', () =>
    wrapper
      .find('TaskForm')
      .prop('submitTask')(tasks[0])
      .then(() => {
        expect(startAddPersonalTask).toHaveBeenCalledTimes(1);
        expect(startAddPersonalTask).toHaveBeenLastCalledWith(tasks[0]);

        expect(onRequestClose).toHaveBeenCalledTimes(1);
      }));

  it('should handle submitTask for group', () => {
    wrapper.setProps({ gid, groupModule, groupName, users });

    return wrapper
      .find('TaskForm')
      .prop('submitTask')(groupTasks[0])
      .then(() => {
        expect(startAddGroupTask).toHaveBeenCalledTimes(1);
        expect(startAddGroupTask).toHaveBeenLastCalledWith(
          groupTasks[0],
          groupName
        );

        expect(addGroupTask).toHaveBeenCalledTimes(1);
        expect(addGroupTask).toHaveBeenLastCalledWith(groupTasks[0]);

        expect(onRequestClose).toHaveBeenCalledTimes(1);
      });
  });
});
