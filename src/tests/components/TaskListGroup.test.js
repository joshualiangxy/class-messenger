import React from 'react';
import { shallow } from 'enzyme';
import TaskListGroup from '../../components/TaskListGroup';
import getSortedTasks from '../../selectors/tasks';
import tasks from '../fixtures/tasks';
import { filtersGrouped } from '../fixtures/filters';

let wrapper;
const sortedList = getSortedTasks(tasks, filtersGrouped);

beforeEach(() => {
  wrapper = shallow(
    <TaskListGroup group={sortedList[Object.keys(sortedList)[0]]} />
  );
});

describe('render', () => {
  it('should render TaskListGroup', () => expect(wrapper).toMatchSnapshot());

  it('should render TaskListGroup with alt group', () => {
    wrapper.setProps({ group: sortedList[Object.keys(sortedList)[1]] });

    expect(wrapper).toMatchSnapshot();
  });
});
