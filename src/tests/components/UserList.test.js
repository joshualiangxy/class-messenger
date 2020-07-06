import React from 'react';
import { shallow } from 'enzyme';
import UserList from '../../components/UserList';
import users from '../fixtures/groupUsers';
import { singleGroup } from '../fixtures/tasks';

const wrapper = shallow(
  <UserList users={users} groupCompletedState={singleGroup[0].completed} />
);

describe('render', () => {
  it('should render UserList', () => expect(wrapper).toMatchSnapshot());

  it('should render UserList with different groupCompletedState', () => {
    wrapper.setProps({ groupCompletedState: singleGroup[1].completed });

    expect(wrapper).toMatchSnapshot();
  });
});
