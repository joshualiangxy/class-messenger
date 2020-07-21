import React from 'react';
import { shallow } from 'enzyme';
import { LeaveGroupModal } from '../../components/LeaveGroupModal';
import groupUsers from '../fixtures/groupUsers';

const isOpen = true;
const onRequestClose = jest.fn();
const startLeaveGroup = jest.fn();
const gid = '72b6b3bb-cb74-4d08-ae67-dfc1b51baaf9';
const users = groupUsers;
const renderLoad = jest.fn();
const admin = false;
const uid = 'testuid2';

const wrapper = shallow(
  <LeaveGroupModal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    startLeaveGroup={startLeaveGroup}
    gid={gid}
    users={users}
    renderLoad={renderLoad}
    admin={admin}
    uid={uid}
  />
);

describe('render', () => {
  it('should allow the non-admin user to leave', () => {
    expect(wrapper).toMatchSnapshot();
  });
  it('should not allow the admin user to leave', () => {
    wrapper.setProps({ uid: 'testuid', admin: true });
    expect(wrapper).toMatchSnapshot();
  });
  it('should allow the only user left to leave', () => {
    wrapper.setProps({ users: users.filter(u => u.uid === 'testuid') });
    expect(wrapper).toMatchSnapshot();
  });
});

describe('leave', () => {
  it('should call startLeaveGroup', () => {
    wrapper.setProps({ uid: 'testuid2', admin: false, users });
    wrapper
      .find('button')
      .at(0)
      .prop('onClick')({ preventDefault: jest.fn() })
      .then(() => {
        expect(startLeaveGroup).toHaveBeenCalledTimes(1);
        expect(startLeaveGroup).toHaveBeenLastCalledWith(gid, 2);
      });
  });
});
