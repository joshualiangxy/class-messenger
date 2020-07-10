import React from 'react';
import { shallow } from 'enzyme';
import { filtersDeadline, filtersName } from '../fixtures/filters';
import { TaskListFilters } from '../../components/TaskListFilters';

const setTextFilters = jest.fn();
const toggleGrouped = jest.fn();
let wrapper;

beforeEach(() => {
  jest.clearAllMocks();

  wrapper = shallow(
    <TaskListFilters
      filters={filtersDeadline}
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
