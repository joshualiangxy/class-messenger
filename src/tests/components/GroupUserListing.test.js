import React from 'react';
import { shallow } from 'enzyme';
import { GroupUserListing } from '../../components/GroupUserListing';
import groupUsers from '../fixtures/groupUsers';

const group = '72b6b3bb-cb74-4d08-ae67-dfc1b51baaf9';
const users = groupUsers;
const setUsers = jest.fn(users => true);
const admin = true;
const setAdmin = jest.fn();
const kickUserLocal = jest.fn();
const uid = 'testuid';
const kickUser = jest.fn((uid, gid) => Promise.resolve());
const setError = jest.fn(err => true);

let wrapper;

beforeEach(() => {
  jest.clearAllMocks();
  wrapper = shallow(
    <GroupUserListing
      users={users}
      setUsers={setUsers}
      group={group}
      admin={admin}
      setAdmin={setAdmin}
      kickUser={kickUser}
      kickUserLocal={kickUserLocal}
      setError={setError}
      uid={uid}
    />
  );
});

describe('render', () => {
  it('should render all the users in the group', () => {
    // 2 users: Robert and Peter
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('.userwrapper')).toHaveLength(2);
  });

  it('should not render buttons for non-admins', () => {
    wrapper.setProps({ admin: false });
    expect(wrapper).toMatchSnapshot();
  });
});

describe('modifying users', () => {
  it('should promote a user', () => {
    expect(users[1].admin).toEqual(false);
    expect(wrapper).toMatchSnapshot();
    // console.log(wrapper.find('button').at(0).text())
    wrapper
      .find('button')
      .at(0)
      .prop('onClick')()
      .then(() => {
        const newusers = users.map(u =>
          u.uid === users[1].uid ? { ...u, admin: true } : u
        );
        expect(setUsers).toHaveBeenCalledTimes(1);
        expect(setUsers).toHaveBeenLastCalledWith(newusers);
        expect(newusers[1].admin).toEqual(true);
      });
  });

  it('should demote a user', () => {
    const users2 = [...groupUsers];
    users2[1].admin = true;
    wrapper.setProps({ users: users2 });
    expect(users2[1].admin).toEqual(true);
    expect(wrapper).toMatchSnapshot();
    // console.log(wrapper.find('button').at(0).text())
    wrapper
      .find('button')
      .at(0)
      .prop('onClick')()
      .then(() => {
        const newusers = users.map(u =>
          u.uid === users[1].uid ? { ...u, admin: false } : u
        );
        expect(setUsers).toHaveBeenCalledTimes(1);
        expect(setUsers).toHaveBeenLastCalledWith(newusers);
        expect(newusers[1].admin).toEqual(false);
      });
  });
  it('should kick users', () => {
    const result = users.filter(u => u.uid === 'testuid');
    expect(wrapper.find('.userwrapper')).toHaveLength(2);
    wrapper
      .find('button')
      .at(1)
      .prop('onClick')()
      .then(() => {
        expect(kickUser).toHaveBeenLastCalledWith(users[1], group);
        expect(kickUserLocal).toHaveBeenLastCalledWith('testuid2');
        expect(setUsers).toHaveBeenLastCalledWith(result);
      });
  });
});
