import React from 'react';
import { shallow } from 'enzyme';
import { GroupSettingsModal } from '../../components/GroupSettingsModal';
import groupUsers from '../fixtures/groupUsers';
import user from '../fixtures/user';

let wrapper;
const isOpen = true;
const onRequestClose = jest.fn();
const groupOne = '72b6b3bb-cb74-4d08-ae67-dfc1b51baaf9';
const users = groupUsers;
const setUsers = jest.fn(users => true);
const admin = true;
const setAdmin = jest.fn();
const kickUserLocal = jest.fn();
const uid1 = 'testuid';
const testUser = {
  displayName: user.displayName,
  studentNum: user.studentNum,
  uid: 'testuid',
  admin: false
};

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
    expect(wrapper.find('.form__error')).toHaveLength(0);
    wrapper.find('input').prop('onChange')({ target: { value: ' ' } });
    wrapper.find('form').at(0).prop('onSubmit')({ preventDefault: jest.fn() });
    expect(wrapper.find('.form__error').text()).toEqual(
      'Please enter an email'
    );
  });

  it('should set the error for invalid users (with valid email)', () => {
    expect(wrapper.find('.form__error')).toHaveLength(0);
    wrapper.find('input').prop('onChange')({ target: { value: '123124' } });
    wrapper
      .find('form')
      .at(0)
      .prop('onSubmit')({ preventDefault: jest.fn() })
      .then(() => expect(wrapper).toMatchSnapshot());
  });

  it('should add the user if valid', () => {
    wrapper.find('input').prop('onChange')({ target: { value: 'email' } });
    wrapper
      .find('form')
      .at(0)
      .prop('onSubmit')({ preventDefault: jest.fn() })
      .then(() => {
        expect(wrapper.find('.form__error').text()).toEqual('Added!');
        expect(setUsers).toHaveBeenCalledTimes(1);
        expect(setUsers).toHaveBeenLastCalledWith([...users, testUser]);
        expect(wrapper).toMatchSnapshot();
      });
  });
});
