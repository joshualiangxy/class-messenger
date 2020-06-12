import React from 'react';
import { shallow } from 'enzyme';
import tasks from '../fixtures/tasks';
import { AddTaskModal } from '../../components/AddTaskModal';

const startAddPersonalTask = jest.fn(() => Promise.resolve());
const onRequestClose = jest.fn();
const wrapper = shallow(
  <AddTaskModal
    startAddPersonalTask={startAddPersonalTask}
    onRequestClose={onRequestClose}
  />
);

describe('render', () => {
  it('should render AddTaskModal', () => expect(wrapper).toMatchSnapshot());
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
});
