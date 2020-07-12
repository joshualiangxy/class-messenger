import React, { useState } from 'react';
import { connect } from 'react-redux';
import {
  sortByName,
  sortByNameReversed,
  sortByDeadline,
  sortByDeadlineReversed
} from '../actions/filters';

export const TaskListHeader = ({
  sortByName,
  sortByNameReversed,
  sortByDeadline,
  sortByDeadlineReversed,
  isGroup
}) => {
  const [nameReversed, setNameReversed] = useState(false);
  const [deadlineReversed, setDeadlineReversed] = useState(false);

  const toggleSortName = () => {
    if (isGroup) return;

    if (!nameReversed) sortByNameReversed();
    else sortByName();
    setNameReversed(!nameReversed);
  };

  const toggleSortDeadline = () => {
    if (isGroup) return;

    if (!deadlineReversed) sortByDeadlineReversed();
    else sortByDeadline();
    setDeadlineReversed(!deadlineReversed);
  };

  return (
    <div className="list-header">
      <div
        className={isGroup ? 'list-header__text' : 'list-header__toggle'}
        onClick={toggleSortName}
      >
        Task
      </div>
      <div
        className={isGroup ? 'list-header__text' : 'list-header__toggle'}
        onClick={toggleSortDeadline}
      >
        Deadline
      </div>
    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  sortByName: () => dispatch(sortByName()),
  sortByNameReversed: () => dispatch(sortByNameReversed()),
  sortByDeadline: () => dispatch(sortByDeadline()),
  sortByDeadlineReversed: () => dispatch(sortByDeadlineReversed())
});

export default connect(undefined, mapDispatchToProps)(TaskListHeader);
