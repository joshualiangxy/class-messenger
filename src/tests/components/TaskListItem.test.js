import React from 'react';
import { shallow } from 'enzyme';
import { TaskListItem } from '../../components/TaskListItem';
import tasks, { groupTasks } from '../fixtures/tasks';
import users from '../fixtures/groupUsers';

let wrapper;
const startRemovePersonalTask = jest.fn();
const downloadFile = jest.fn(() => Promise.resolve(true));
const removeAdmin = jest.fn();
const removeUserFromTask = jest.fn();
const toggleGroupTaskComplete = jest.fn();
const uid = 'testuid';
const startRemoveGroupTask = jest.fn(() => Promise.resolve(true));
const removeGroupTask = jest.fn();
const startToggleCompletedPersonal = jest.fn();
const startToggleCompletedGroup = jest.fn(() => Promise.resolve(true));
const task = tasks[0];
const groupTask = groupTasks[0];
const groupName = groupTask.groupName;
const gid = groupTask.gid;
const id = task.id;
const completed = task.completed;

beforeEach(() => {
  jest.clearAllMocks();

  wrapper = shallow(
    <TaskListItem
      task={task}
      uid={uid}
      removeAdmin={removeAdmin}
      removeUserFromTask={removeUserFromTask}
      startRemovePersonalTask={startRemovePersonalTask}
      startRemoveGroupTask={startRemoveGroupTask}
      removeGroupTask={removeGroupTask}
      toggleGroupTaskComplete={toggleGroupTaskComplete}
      startToggleCompletedPersonal={startToggleCompletedPersonal}
      startToggleCompletedGroup={startToggleCompletedGroup}
      showGroup={false}
      dashboard={true}
      downloadFile={downloadFile}
    />
  );
});

describe('render', () => {
  it('should render personal TaskListItem', () =>
    expect(wrapper).toMatchSnapshot());

  it('should render personal TaskListItem with group/module shown', () => {
    wrapper = shallow(
      <TaskListItem
        task={tasks[1]}
        uid={uid}
        removeAdmin={removeAdmin}
        removeUserFromTask={removeUserFromTask}
        startRemovePersonalTask={startRemovePersonalTask}
        startRemoveGroupTask={startRemoveGroupTask}
        removeGroupTask={removeGroupTask}
        toggleGroupTaskComplete={toggleGroupTaskComplete}
        startToggleCompletedPersonal={startToggleCompletedPersonal}
        startToggleCompletedGroup={startToggleCompletedGroup}
        showGroup={true}
        dashboard={true}
        downloadFile={downloadFile}
      />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should render TaskListItem with group task on dashboard', () => {
    wrapper = shallow(
      <TaskListItem
        task={{ ...groupTask, completed: false }}
        uid={uid}
        removeAdmin={removeAdmin}
        removeUserFromTask={removeUserFromTask}
        startRemovePersonalTask={startRemovePersonalTask}
        startRemoveGroupTask={startRemoveGroupTask}
        removeGroupTask={removeGroupTask}
        toggleGroupTaskComplete={toggleGroupTaskComplete}
        startToggleCompletedPersonal={startToggleCompletedPersonal}
        startToggleCompletedGroup={startToggleCompletedGroup}
        showGroup={true}
        dashboard={true}
        admin={false}
        groupName={groupName}
        downloadFile={downloadFile}
      />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should render TaskListItem with group task on GroupPage as admin', () => {
    wrapper = shallow(
      <TaskListItem
        task={groupTask}
        uid={uid}
        removeAdmin={removeAdmin}
        removeUserFromTask={removeUserFromTask}
        users={users}
        startRemovePersonalTask={startRemovePersonalTask}
        startRemoveGroupTask={startRemoveGroupTask}
        removeGroupTask={removeGroupTask}
        toggleGroupTaskComplete={toggleGroupTaskComplete}
        startToggleCompletedPersonal={startToggleCompletedPersonal}
        startToggleCompletedGroup={startToggleCompletedGroup}
        showGroup={false}
        dashboard={false}
        admin={true}
        groupName={groupName}
        downloadFile={downloadFile}
      />
    );
    wrapper.find('div').at(2).prop('onClick')();

    expect(wrapper).toMatchSnapshot();
  });

  it('should render TaskListItem with group task on GroupPage as regular user', () => {
    wrapper = shallow(
      <TaskListItem
        task={groupTask}
        uid={uid}
        removeAdmin={removeAdmin}
        removeUserFromTask={removeUserFromTask}
        users={users}
        startRemovePersonalTask={startRemovePersonalTask}
        startRemoveGroupTask={startRemoveGroupTask}
        removeGroupTask={removeGroupTask}
        toggleGroupTaskComplete={toggleGroupTaskComplete}
        startToggleCompletedPersonal={startToggleCompletedPersonal}
        startToggleCompletedGroup={startToggleCompletedGroup}
        showGroup={false}
        dashboard={false}
        admin={false}
        groupName={groupName}
        downloadFile={downloadFile}
      />
    );
    wrapper.find('div').at(2).prop('onClick')();

    expect(wrapper).toMatchSnapshot();
  });
});

describe('completed checkbox', () => {
  it('should toggle completed state for personal task', () => {
    expect(wrapper.find('input').prop('checked')).toBe(completed);

    wrapper.find('input').prop('onChange')();

    expect(wrapper.find('input').prop('checked')).toBe(!completed);

    expect(startToggleCompletedPersonal).toHaveBeenCalledTimes(1);
    expect(startToggleCompletedPersonal).toHaveBeenLastCalledWith(
      id,
      completed
    );
  });

  it('should toggle completed state for group task on dashboard', () => {
    wrapper = shallow(
      <TaskListItem
        task={{ ...groupTask, completed: false }}
        uid={uid}
        removeAdmin={removeAdmin}
        removeUserFromTask={removeUserFromTask}
        users={users}
        startRemovePersonalTask={startRemovePersonalTask}
        startRemoveGroupTask={startRemoveGroupTask}
        removeGroupTask={removeGroupTask}
        toggleGroupTaskComplete={toggleGroupTaskComplete}
        startToggleCompletedPersonal={startToggleCompletedPersonal}
        startToggleCompletedGroup={startToggleCompletedGroup}
        showGroup={false}
        dashboard={true}
        admin={false}
        groupName={groupName}
        downloadFile={downloadFile}
      />
    );

    expect(wrapper.find('input').prop('checked')).toBe(
      groupTask.completed[uid]
    );

    wrapper.find('input').prop('onChange')();

    expect(wrapper.find('input').prop('checked')).toBe(
      !groupTask.completed[uid]
    );

    expect(startToggleCompletedGroup).toHaveBeenCalledTimes(1);
    expect(startToggleCompletedGroup).toHaveBeenLastCalledWith(
      groupTask.id,
      groupTask.gid,
      groupTask.completed[uid]
    );
  });

  it('should toggle completed state for group task GroupPage', () => {
    wrapper = shallow(
      <TaskListItem
        task={groupTask}
        uid={uid}
        removeAdmin={removeAdmin}
        removeUserFromTask={removeUserFromTask}
        users={users}
        startRemovePersonalTask={startRemovePersonalTask}
        startRemoveGroupTask={startRemoveGroupTask}
        removeGroupTask={removeGroupTask}
        toggleGroupTaskComplete={toggleGroupTaskComplete}
        startToggleCompletedPersonal={startToggleCompletedPersonal}
        startToggleCompletedGroup={startToggleCompletedGroup}
        showGroup={false}
        dashboard={false}
        admin={false}
        groupName={groupName}
        downloadFile={downloadFile}
      />
    );

    expect(wrapper.find('input').at(0).prop('checked')).toBe(
      groupTask.completed[uid]
    );

    wrapper.find('input').at(0).prop('onChange')();

    expect(wrapper.find('input').at(0).prop('checked')).toBe(
      !groupTask.completed[uid]
    );

    expect(startToggleCompletedGroup).toHaveBeenCalledTimes(1);
    expect(startToggleCompletedGroup).toHaveBeenLastCalledWith(
      groupTask.id,
      groupTask.gid,
      groupTask.completed[uid]
    );
  });

  it('should set completed state to false in GroupPage if user not involved', () => {
    startToggleCompletedGroup.mockImplementation(() => Promise.resolve(false));
    wrapper = shallow(
      <TaskListItem
        task={groupTask}
        uid={uid}
        removeAdmin={removeAdmin}
        removeUserFromTask={removeUserFromTask}
        users={users}
        startRemovePersonalTask={startRemovePersonalTask}
        startRemoveGroupTask={startRemoveGroupTask}
        removeGroupTask={removeGroupTask}
        toggleGroupTaskComplete={toggleGroupTaskComplete}
        startToggleCompletedPersonal={startToggleCompletedPersonal}
        startToggleCompletedGroup={startToggleCompletedGroup}
        showGroup={false}
        dashboard={false}
        admin={false}
        groupName={groupName}
        downloadFile={downloadFile}
      />
    );

    expect(wrapper.find('input').at(0).prop('checked')).toBe(
      groupTask.completed[uid]
    );

    wrapper.find('input').at(0).prop('onChange')();

    expect(wrapper.find('input').at(0).prop('checked')).toBe(
      !groupTask.completed[uid]
    );

    expect(startToggleCompletedGroup).toHaveBeenCalledTimes(1);
    expect(startToggleCompletedGroup).toHaveBeenLastCalledWith(
      groupTask.id,
      groupTask.gid,
      groupTask.completed[uid]
    );

    return Promise.resolve(
      setTimeout(() => {
        expect(wrapper.find('input').prop('checked')).toBe(false);
      }, 100)
    );
  });
});

describe('clickable div', () => {
  it('should toggle visibility of div', () => {
    wrapper.find('div').at(2).prop('onClick')();

    expect(wrapper).toMatchSnapshot();

    wrapper.find('div').at(2).prop('onClick')();

    expect(wrapper).toMatchSnapshot();
  });
});

describe('download button', () => {
  beforeEach(() => {
    wrapper = shallow(
      <TaskListItem
        task={groupTask}
        uid={uid}
        removeAdmin={removeAdmin}
        removeUserFromTask={removeUserFromTask}
        users={users}
        startRemovePersonalTask={startRemovePersonalTask}
        startRemoveGroupTask={startRemoveGroupTask}
        removeGroupTask={removeGroupTask}
        toggleGroupTaskComplete={toggleGroupTaskComplete}
        startToggleCompletedPersonal={startToggleCompletedPersonal}
        startToggleCompletedGroup={startToggleCompletedGroup}
        showGroup={false}
        dashboard={false}
        admin={true}
        groupName={groupName}
        downloadFile={downloadFile}
      />
    );
  });

  it('should call onDownload on click', () => {
    wrapper.find('div').at(2).prop('onClick')();
    wrapper.find('button').at(0).prop('onClick')({ stopPropagation: () => {} });

    expect(downloadFile).toHaveBeenCalledTimes(1);
    expect(downloadFile).toHaveBeenLastCalledWith(groupTask.gid, groupTask.id);
  });

  it('should remove admin priviledges if user is no longer admin on click', () => {
    downloadFile.mockImplementation(() => Promise.resolve(false));

    wrapper.find('div').at(2).prop('onClick')();
    wrapper.find('button').at(0).prop('onClick')({ stopPropagation: () => {} });

    expect(downloadFile).toHaveBeenCalledTimes(1);
    expect(downloadFile).toHaveBeenLastCalledWith(groupTask.gid, groupTask.id);

    return Promise.resolve(
      setTimeout(() => {
        expect(removeAdmin).toHaveBeenCalledTimes(1);
      }, 100)
    );
  });
});

describe('edit task button', () => {
  it('should open EditTaskModal on click', () => {
    wrapper.find('div').at(2).prop('onClick')();

    expect(wrapper.find('Connect(EditTaskModal)').prop('isOpen')).toBe(false);

    wrapper.find('button').at(0).prop('onClick')({ stopPropagation: () => {} });

    expect(wrapper.find('Connect(EditTaskModal)').prop('isOpen')).toBe(true);
  });
});

describe('remove task button', () => {
  it('should call startRemovePersonalTask on click', () => {
    wrapper.find('div').at(2).prop('onClick')();

    wrapper.find('button').at(1).prop('onClick')({ stopPropagation: () => {} });

    expect(startRemovePersonalTask).toHaveBeenCalledTimes(1);
    expect(startRemovePersonalTask).toHaveBeenLastCalledWith(id);
  });
});
