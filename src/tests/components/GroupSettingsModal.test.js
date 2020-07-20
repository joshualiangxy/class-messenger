import React from 'react';
import { shallow } from 'enzyme';
import { GroupSettingsModal } from '../../components/GroupSettingsModal';
import groupUsers from '../fixtures/groupUsers';

let wrapper;
const isOpen = true;
const onRequestClose = jest.fn();
const groupOne = 'one';
const groupTwo = 'two';
const users = groupUsers;
const setUsers = jest.fn(users => true);
const admin = true;
const setAdmin = jest.fn();
const kickUserLocal = jest.fn();
const uid1 = 'testuid';
const uid2 = 'testuid2';
const newUser = {
  displayName: 'Clarisse',
  studentNum: 'A0178221B',
  uid: 'testuid3'
};
const addNewUser = jest.fn((uid, gid) => Promise.resolve());
const getUser = jest.fn(email => {
  switch (email) {
    case 'email':
      return Promise.resolve(newUser);
    default:
      return Promise.resolve(undefined);
  }
});
const recheckAdmin = jest.fn((uid, gid) => {
  switch (uid) {
    case uid1:
      return Promise.resolve(true);
    case uid2:
      return Promise.resolve(false);
    default:
      return Promise.resolve(false);
  }
});

beforeEach(() => {
  jest.clearAllMocks();
  wrapper = shallow(
    <GroupSettingsModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      group={groupOne}
      users={users}
      setUsers={setUsers}
      admin={admin}
      setAdmin={setAdmin}
      uid={uid1}
      kickUserLocal={kickUserLocal}
    />
  );
});

describe('render', () => {
  it('should render for admins', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('input')).toHaveLength(1);
    expect(wrapper.find('input').at(0).prop('placeholder')).toEqual(
      'Email (required)'
    );
    expect(wrapper.find('Connect(GroupUserListing)')).toHaveLength(1);
  });

  it('should render for non-admins', () => {
    wrapper.setProps({ admin: false });
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('input')).toHaveLength(0);
    expect(wrapper.find('Connect(GroupUserListing)')).toHaveLength(1);
  });
});

describe('addUser', () => {
  it('should change the input value when typed into', () => {
    expect(wrapper.find('input').at(0).prop('value')).toEqual('');
    wrapper.find('input').prop('onChange')({ target: { value: 'email' } });
    expect(wrapper.find('input').at(0).prop('value')).toEqual('email');
  });
  it('should set the error for invalid emails', () => {
    expect(wrapper.find('div.error').text()).toEqual('')
    wrapper.find('input').prop('onChange')({ target: { value: ' ' } });
    wrapper.find('form').at(0).prop('onSubmit')({ preventDefault: jest.fn() });
    expect(wrapper.find('div.error').text()).toEqual('Please enter an email')
  });

  // it('should set the error for invalid users (with valid email)', () => {
  //   expect(wrapper.find('div.error').text()).toEqual('')
  //   wrapper.find('input').prop('onChange')({ target: { value: 'validemail' } });
  //   wrapper.find('form').at(0).prop('onSubmit')({ preventDefault: jest.fn() });
  //   expect(recheckAdmin).toHaveBeenCalledTimes(1)
  //   expect(wrapper.find('div.error').text()).toEqual('No user found')
  
  // })
});
