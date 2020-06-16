import React from 'react';
import { connect } from 'react-redux';
import getSortedTasks from '../selectors/tasks';
import TaskListItem from './TaskListItem';

//export const GroupTaskList = ({ gid }) => {
//return (
//<div>
//{Object.keys(sortedList).length === 0 ? (
//<h3>No tasks yet</h3>
//) : (
//Object.values(sortedList)[0].tasks.
//)}
//</div>
//) }
