import React from 'react';
import { shallow } from 'enzyme';
import TaskDashboardPage from '../../components/TaskDashboardPage';

const wrapper = shallow(<TaskDashboardPage />);

describe('render', () => {
  it('should render TaskDashboardPage', () =>
    expect(wrapper).toMatchSnapshot());
});

describe('add task button', () => {
  it('should open AddTaskModal on click', () => {
    expect(wrapper.find('Connect(AddTaskModal)').prop('isOpen')).toBe(false);

    wrapper.find('button').prop('onClick')();

    expect(wrapper.find('Connect(AddTaskModal)').prop('isOpen')).toBe(true);
  });
});
