import React from 'react';
import { connect } from 'react-redux';
import {
  sortByName,
  sortByNameReversed,
  sortByDeadline,
  sortByDeadlineReversed,
  setTextFilter,
  toggleGrouped
} from '../actions/filters';

export const TaskListFilters = ({
  filters,
  sortByName,
  sortByNameReversed,
  sortByDeadline,
  sortByDeadlineReversed,
  setTextFilters,
  toggleGrouped
}) => {
  const onSortChange = e => {
    const sortType = e.target.value;

    switch (sortType) {
      case 'deadline':
        sortByDeadline();
        break;
      case 'deadlineReversed':
        sortByDeadlineReversed();
        break;
      case 'name':
        sortByName();
        break;
      case 'nameReversed':
        sortByNameReversed();
        break;
      default:
        sortByDeadline();
        break;
    }
  };

  const onTextChange = e => setTextFilters(e.target.value);

  return (
    <div>
      <input
        type="text"
        value={filters.text}
        onChange={onTextChange}
        placeholder="Search tasks"
      />
      <input
        type="checkbox"
        id="grouped"
        checked={filters.grouped}
        onChange={toggleGrouped}
      />
      <label htmlFor="grouped"> Group tasks</label>
      <select value={filters.sortBy} onChange={onSortChange}>
        <option value="deadline">Deadline</option>
        <option value="deadlineReversed">Deadline Reversed</option>
        <option value="name">Name</option>
        <option value="nameReversed">Name Reversed</option>
      </select>
    </div>
  );
};

const mapStateToProps = ({ filters }) => ({ filters });

const mapDispatchToProps = dispatch => ({
  sortByName: () => dispatch(sortByName()),
  sortByNameReversed: () => dispatch(sortByNameReversed()),
  sortByDeadline: () => dispatch(sortByDeadline()),
  sortByDeadlineReversed: () => dispatch(sortByDeadlineReversed()),
  setTextFilters: text => dispatch(setTextFilter(text)),
  toggleGrouped: () => dispatch(toggleGrouped())
});

export default connect(mapStateToProps, mapDispatchToProps)(TaskListFilters);
