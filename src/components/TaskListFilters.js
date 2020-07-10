import React from 'react';
import { connect } from 'react-redux';
import { setTextFilter, toggleGrouped } from '../actions/filters';

export const TaskListFilters = ({ filters, setTextFilters, toggleGrouped }) => {
  const onTextChange = e => setTextFilters(e.target.value);

  return (
    <div className="content-container">
      <div className="input-group">
        <div className="input-group__item">
          <input
            className="text-input"
            type="text"
            value={filters.text}
            onChange={onTextChange}
            placeholder="Search tasks"
          />
        </div>
        <div className="input-group__item">
          <label className="switch">
            <input
              className="toggle"
              type="checkbox"
              checked={filters.grouped}
              onChange={toggleGrouped}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ filters }) => ({ filters });

const mapDispatchToProps = dispatch => ({
  setTextFilters: text => dispatch(setTextFilter(text)),
  toggleGrouped: () => dispatch(toggleGrouped())
});

export default connect(mapStateToProps, mapDispatchToProps)(TaskListFilters);
