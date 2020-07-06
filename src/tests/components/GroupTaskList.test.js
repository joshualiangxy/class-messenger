import React from 'react';
import { shallow } from 'enzyme';
import GroupTaskList from '../../components/GroupTaskList';
import { singleGroup as tasks } from '../fixtures/tasks';
import users from '../fixtures/groupUsers';

const wrapper = shallow(<GroupTaskList tasks={tasks} users={users} />);

describe('render', () => {
  it('should render GroupTaskList', () => expect(wrapper).toMatchSnapshot());

  it('should render GroupTaskList without tasks', () => {
    wrapper.setProps({ tasks: [] });

    expect(wrapper).toMatchSnapshot();
  });
});
