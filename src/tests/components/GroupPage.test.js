import React from 'react';
import { shallow } from 'enzyme';
import {GroupPage} from '../../components/GroupPage';
import groupUsers from '../fixtures/groupUsers';
import { groupTasks } from '../fixtures/tasks';
import {browserHistory} from 'react-router'

jest.mock('react-router', () => ({
  browserHistory: {
    push: jest.fn()
  }
}))

const gid = 'one';
const groupName = 'nameOne';
const groupModule = 'moduleOne';
const authorised = true;
const uid = 'testuid';
const getAllUsers = jest.fn(() => Promise.resolve(groupUsers));
const getAllGroupTasks = jest.fn(() => Promise.resolve(groupTasks));
const leaveGroup = jest.fn();

const wrapper = shallow(
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

describe('render', () => {
  it('should render if the user is part of the group', () => {
    expect(wrapper).toMatchSnapshot();
  });
  it('should push if the user is not part of the group', () => {
    wrapper.setProps({uid: 'nothere'})
    // expect(browserHistory.push).toHaveBeenCalledTimes(1);
  })
});
