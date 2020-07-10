import React from 'react';
import { shallow } from 'enzyme';
import { TaskListHeader } from '../../components/TaskListHeader';

const sortByName = jest.fn();
const sortByNameReversed = jest.fn();
const sortByDeadline = jest.fn();
const sortByDeadlineReversed = jest.fn();
const wrapper = shallow(
  <TaskListHeader
    sortByName={sortByName}
    sortByNameReversed={sortByNameReversed}
    sortByDeadline={sortByDeadline}
    sortByDeadlineReversed={sortByDeadlineReversed}
  />
);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('render', () => {
  it('should render TaskListHeader', () => expect(wrapper).toMatchSnapshot());
});

describe('toggle task name', () => {
  it('should toggle sorting of tasks to name reversed', () => {
    wrapper.find('div').at(1).prop('onClick')();

    expect(sortByNameReversed).toHaveBeenCalledTimes(1);
    expect(sortByName).toHaveBeenCalledTimes(0);
  });

  it('should toggle sorting of tasks to name', () => {
    wrapper.find('div').at(1).prop('onClick')();
    wrapper.find('div').at(1).prop('onClick')();

    expect(sortByNameReversed).toHaveBeenCalledTimes(1);
    expect(sortByName).toHaveBeenCalledTimes(1);
  });
});

describe('toggle task deadline', () => {
  it('should toggle sorting of tasks to deadline reversed', () => {
    wrapper.find('div').at(2).prop('onClick')();

    expect(sortByDeadlineReversed).toHaveBeenCalledTimes(1);
    expect(sortByDeadline).toHaveBeenCalledTimes(0);
  });

  it('should toggle sorting of tasks to deadline', () => {
    wrapper.find('div').at(2).prop('onClick')();
    wrapper.find('div').at(2).prop('onClick')();

    expect(sortByDeadlineReversed).toHaveBeenCalledTimes(1);
    expect(sortByDeadline).toHaveBeenCalledTimes(1);
  });
});
