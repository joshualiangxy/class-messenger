import React from 'react';
import { shallow } from 'enzyme';
import { GroupPage } from '../../components/GroupPage';
import groupUsers from '../fixtures/groupUsers';
import { groupTasks } from '../fixtures/tasks';
import { browserHistory } from 'react-router';

jest.mock('react-router', () => ({
  browserHistory: {
    push: jest.fn()
  }
}));

const gid = 'one';
const groupName = 'nameOne';
const groupModule = 'moduleOne';
const authorised = true;
const uid = 'testuid';
const getAllUsers = jest.fn(() => Promise.resolve(groupUsers));
const getAllGroupTasks = jest.fn(() => Promise.resolve(groupTasks));
const leaveGroup = jest.fn();
let wrapper;

beforeEach(() => {
  wrapper = shallow(
    <GroupPage
      gid={gid}
      groupName={groupName}
      groupModule={groupModule}
      authorised={authorised}
      uid={uid}
      getAllUsers={getAllUsers}
      getAllGroupTasks={getAllGroupTasks}
      leaveGroup={leaveGroup}
    />
  );
});

describe('render', () => {
  it('should render if the user is part of the group', () => {
    expect(wrapper).toMatchSnapshot();
  });
});

describe('group tasks', () => {
  it('should open the add tasks modal when clicked', () => {
    expect(wrapper.find('Connect(AddTaskModal)').prop('isOpen')).toBe(false);
    // console.log(wrapper.find("button").at(0).text())
    wrapper.find('button').at(0).prop('onClick')();
    expect(wrapper.find('Connect(AddTaskModal)').prop('isOpen')).toBe(true);
  });
});

describe('group settings', () => {
  it('should open the add tasks modal when clicked', () => {
    expect(wrapper.find('Connect(GroupSettingsModal)').prop('isOpen')).toBe(false);
    // console.log(wrapper.find("button").at(0).text())
    wrapper.find('button').at(1).prop('onClick')();
    expect(wrapper.find('Connect(GroupSettingsModal)').prop('isOpen')).toBe(true);
  });
});


describe('leave group', () => {
  it('should open the add tasks modal when clicked', () => {
    expect(wrapper.find('Connect(LeaveGroupModal)').prop('isOpen')).toBe(false);
    // console.log(wrapper.find("button").at(0).text())
    wrapper.find('button').at(2).prop('onClick')();
    expect(wrapper.find('Connect(LeaveGroupModal)').prop('isOpen')).toBe(true);
  });
});
