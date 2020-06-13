import React from 'react';
import { shallow } from 'enzyme';
import { filtersDeadline, filtersName } from '../fixtures/filters';
import { TaskListFilters } from '../../components/TaskListFilters';

const sortByName = jest.fn();
const sortByNameReversed = jest.fn();
const sortByDeadline = jest.fn();
const sortByDeadlineReversed = jest.fn();
const setTextFilters = jest.fn();
const toggleGrouped = jest.fn();
let wrapper;

beforeEach(() => {
  sortByName.mockClear();
  sortByNameReversed.mockClear();
  sortByDeadline.mockClear();
  sortByDeadlineReversed.mockClear();
  setTextFilters.mockClear();
  toggleGrouped.mockClear();

  wrapper = shallow(
    <TaskListFilters
      filters={filtersDeadline}
      sortByName={sortByName}
      sortByNameReversed={sortByNameReversed}
      sortByDeadline={sortByDeadline}
      sortByDeadlineReversed={sortByDeadlineReversed}
      setTextFilters={setTextFilters}
      toggleGrouped={toggleGrouped}
    />
  );
});

describe('render', () => {
  it('should render TaskListFilters', () => expect(wrapper).toMatchSnapshot());

  it('should render TaskListFilters with alt filters', () => {
    wrapper.setProps({ filters: filtersName });
    expect(wrapper).toMatchSnapshot();
  });
});

describe('text filter', () => {
  it('should call setTextFilters on input change', () => {
    const value = 'filter';

    expect(wrapper.find('input').at(0).prop('value')).toBe(
      filtersDeadline.text
    );

    wrapper.find('input').at(0).prop('onChange')({ target: { value } });

    expect(setTextFilters).toHaveBeenCalledTimes(1);
    expect(setTextFilters).toHaveBeenLastCalledWith(value);
  });
});

describe('grouped checkbox', () => {
  it('should toggle grouped state on change', () => {
    expect(wrapper.find('input').at(1).prop('checked')).toBe(
      filtersDeadline.grouped
    );

    wrapper.find('input').at(1).prop('onChange')();

    expect(toggleGrouped).toHaveBeenCalledTimes(1);
  });
});

describe('select sort', () => {
  it('should sort by deadline', () => {
    const value = 'deadline';
    const sortEvent = { target: { value } };
    wrapper.setProps({ filters: filtersName });

    wrapper.find('select').simulate('change', sortEvent);

    expect(sortByDeadline).toHaveBeenCalledTimes(1);
  });

  it('should sort by name', () => {
    const value = 'name';
    const sortEvent = { target: { value } };

    wrapper.find('select').simulate('change', sortEvent);

    expect(sortByName).toHaveBeenCalledTimes(1);
  });

  it('should sort by deadline reversed', () => {
    const value = 'deadlineReversed';
    const sortEvent = { target: { value } };

    wrapper.find('select').simulate('change', sortEvent);

    expect(sortByDeadlineReversed).toHaveBeenCalledTimes(1);
  });

  it('should sort by name reversed', () => {
    const value = 'nameReversed';
    const sortEvent = { target: { value } };

    wrapper.find('select').simulate('change', sortEvent);

    expect(sortByNameReversed).toHaveBeenCalledTimes(1);
  });
});
