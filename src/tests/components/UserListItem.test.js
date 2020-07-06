import React from 'react';
import { shallow } from 'enzyme';
import UserListItem from '../../components/UserListItem';
import users from '../fixtures/groupUsers';

let wrapper;
const removeUser = jest.fn();
const addUser = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();

  wrapper = shallow(
    <UserListItem
      user={users[0]}
      initialPick={false}
      removeUser={removeUser}
      addUser={addUser}
    />
  );
});

describe('render', () => {
  it('should render UserListItem', () => expect(wrapper).toMatchSnapshot());

  it('should render UserListItem for alt user', () => {
    wrapper = shallow(
      <UserListItem
        user={users[1]}
        initialPick={true}
        removeUser={removeUser}
        addUser={addUser}
      />
    );

    expect(wrapper).toMatchSnapshot();
  });
});

describe('checkbox', () => {
  it('should toggle the picked status of user', () => {
    wrapper.find('input').prop('onChange')();

    expect(wrapper.find('input').prop('checked')).toBe(true);

    wrapper.find('input').prop('onChange')();

    expect(wrapper.find('input').prop('checked')).toBe(false);
  });

  it('should call addUser if toggling from false to true', () => {
    wrapper.find('input').prop('onChange')();

    expect(addUser).toHaveBeenCalledTimes(1);
    expect(addUser).toHaveBeenLastCalledWith(users[0].uid);
  });

  it('should call removeUser if toggling from true to false', () => {
    wrapper = shallow(
      <UserListItem
        user={users[1]}
        initialPick={true}
        removeUser={removeUser}
        addUser={addUser}
      />
    );

    wrapper.find('input').prop('onChange')();

    expect(removeUser).toHaveBeenCalledTimes(1);
    expect(removeUser).toHaveBeenLastCalledWith(users[1].uid);
  });
});
