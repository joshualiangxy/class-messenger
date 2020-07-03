import React from 'react';
import { shallow } from 'enzyme';
import { EditTaskModal } from '../../components/EditTaskModal';
import tasks, { groupTasks } from '../fixtures/tasks';
import users from '../fixtures/groupUsers';

const startEditPersonalTask = jest.fn(() => Promise.resolve());
const startEditGroupTask = jest.fn(() => Promise.resolve(true));
const editGroupTask = jest.fn();
const removeAdmin = jest.fn();
const onRequestClose = jest.fn();
const task = tasks[2];
const groupTask = groupTasks[1];
const gid = groupTask.gid;
const groupModule = 'groupModule';
const groupName = 'groupName';
let wrapper;

beforeEach(() => {
  jest.clearAllMocks();

  wrapper = shallow(
    <EditTaskModal
      startEditPersonalTask={startEditPersonalTask}
      startEditGroupTask={startEditGroupTask}
      onRequestClose={onRequestClose}
      task={task}
      isOpen={true}
      removeAdmin={removeAdmin}
      editGroupTask={editGroupTask}
    />
  );
});

describe('render', () => {
  it('should render EditTaskModal', () => expect(wrapper).toMatchSnapshot());

  it('should render EditTaskModal with alternate task', () => {
    wrapper.setProps({ task: tasks[3] });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render EditTaskModal with a group task', () => {
    wrapper.setProps({ task: groupTask, gid, groupModule, groupName, users });
    expect(wrapper).toMatchSnapshot();
  });
});

describe('submit task', () => {
  const id = task.id;

  it('should handle submitTask for personal tasks', () =>
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

  it('should handle submitTask for group tasks', () => {
    const id = groupTask.id;
    wrapper.setProps({ task: groupTask, gid, groupModule, groupName, users });

    return wrapper
      .find('TaskForm')
      .prop('submitTask')({ ...groupTasks[2], id, gid })
      .then(() => {
        expect(startEditGroupTask).toHaveBeenCalledTimes(1);
        expect(startEditGroupTask).toHaveBeenLastCalledWith(
          id,
          { ...groupTasks[2], id, gid },
          groupName,
          groupTask
        );

        expect(editGroupTask).toHaveBeenCalledTimes(1);
        expect(editGroupTask).toHaveBeenLastCalledWith(id, {
          ...groupTasks[2],
          id,
          gid
        });

        expect(onRequestClose).toHaveBeenCalledTimes(1);
      });
  });

  it('should not submit task if user is not admin', () => {
    const id = groupTask.id;
    wrapper.setProps({ task: groupTask, gid, groupModule, groupName, users });
    startEditGroupTask.mockImplementation(() => Promise.resolve(false));

    return wrapper
      .find('TaskForm')
      .prop('submitTask')({ ...groupTasks[2], id, gid })
      .then(() => {
        expect(startEditGroupTask).toHaveBeenCalledTimes(1);
        expect(startEditGroupTask).toHaveBeenLastCalledWith(
          id,
          { ...groupTasks[2], id, gid },
          groupName,
          groupTask
        );

        expect(removeAdmin).toHaveBeenCalledTimes(1);

        expect(onRequestClose).toHaveBeenCalledTimes(1);
      });
  });
});
