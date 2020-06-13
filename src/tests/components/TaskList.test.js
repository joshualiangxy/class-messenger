import React from 'react';
import { shallow } from 'enzyme';
import { TaskList } from '../../components/TaskList';
import getSortedTasks from '../../selectors/tasks';
import tasks from '../fixtures/tasks';
import {
  filtersGrouped,
  filtersDeadline,
  filtersName,
  filtersDeadlineReversed,
  filtersNameReversed
} from '../fixtures/filters';

let wrapper;

beforeEach(() => {
  wrapper = shallow(
    <TaskList
      sortedList={getSortedTasks(tasks, filtersGrouped)}
      grouped={false}
    />
  );
});

describe('render', () => {
  it('should render TaskList with no tasks text', () => {
    wrapper = shallow(
      <TaskList
        sortedList={getSortedTasks([], filtersGrouped)}
        grouped={true}
      />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should render TaskList with tasks in groups', () => {
    wrapper.setProps({ grouped: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render TaskList with tasks ungrouped', () => {
    wrapper.setProps({
      sortedList: getSortedTasks(tasks, filtersDeadline)
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('should render TaskList with tasks sorted by name', () => {
    wrapper.setProps({
      sortedList: getSortedTasks(tasks, filtersName)
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('should render TaskList with tasks sorted by deadline in reverse', () => {
    wrapper.setProps({
      sortedList: getSortedTasks(tasks, filtersDeadlineReversed)
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('should render TaskList with tasks sorted by name in reverse', () => {
    wrapper.setProps({
      sortedList: getSortedTasks(tasks, filtersNameReversed)
    });

    expect(wrapper).toMatchSnapshot();
  });
});
