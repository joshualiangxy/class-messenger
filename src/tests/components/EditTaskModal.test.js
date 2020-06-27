import React from 'react';
import { shallow } from 'enzyme';
import tasks from '../fixtures/tasks';
import { EditTaskModal } from '../../components/EditTaskModal';

const startEditPersonalTask = jest.fn(() => Promise.resolve());
const startEditGroupTask = jest.fn(() => Promise.resolve());
const onRequestClose = jest.fn();
const task = tasks[2];
let wrapper;

beforeEach(() => {
  wrapper = shallow(
    <EditTaskModal
      startEditPersonalTask={startEditPersonalTask}
      startEditGroupTask={startEditGroupTask}
      onRequestClose={onRequestClose}
      task={task}
    />
  );
});

describe('render', () => {
  it('should render EditTaskModal', () => expect(wrapper).toMatchSnapshot());

  it('should render EditTaskModal with alternate task', () => {
    wrapper.setProps({ task: tasks[3] });
    expect(wrapper).toMatchSnapshot();
  });
});

describe('submit task', () => {
  const id = task.id;

  it('should handle submitTask', () =>
    wrapper
      .find('TaskForm')
      .prop('submitTask')({
        ...tasks[0],
        id
      })
      .then(() => {
        expect(startEditPersonalTask).toHaveBeenCalledTimes(1);
        expect(startEditPersonalTask).toHaveBeenLastCalledWith(id, {
          ...tasks[0],
          id
        });

        expect(onRequestClose).toHaveBeenCalledTimes(1);
      }));
});
