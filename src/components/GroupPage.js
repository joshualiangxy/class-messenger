import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import LoadingPage from './LoadingPage';
import AddUserModal from './AddUserModal';
import LeaveGroupModal from './LeaveGroupModal';
import AddTaskModal from './AddTaskModal';
import GroupTaskList from './GroupTaskList';
import { getAllUsers } from '../actions/groups';
import { getAllGroupTasks } from '../actions/tasks';
import { history } from '../routers/AppRouter';

const GroupPage = ({ match, groups, userGroups }) => {
  const gid = match.params.id;
  const group = groups.find(group => group.gid === gid);
  // var isAdmin = true; // Not used right now, but may be useful to store it here for any admin operations later.

  // For Modal
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // TODO: Add the authentication under useEffect.
  // This may need us to add a new field for the object returned, because I don't want to go through every user object to check if an id is there.
  useEffect(() => {
    if (!userGroups.find(id => id === gid)) history.push('/groups');
    const promises = [];
    promises.push(getAllUsers(gid).then(users => setUsers(users)));
    promises.push(getAllGroupTasks(gid).then(tasks => setTasks(tasks)));
    Promise.all(promises).then(() => setLoading(false));
  }, []);

  const addGroupTask = task => setTasks([...tasks, task]);

  const closeAddUser = () => setAddUserOpen(false);

  const openAddUser = () => setAddUserOpen(true);

  const onLeaveCancel = () => setLeaveOpen(false);

  const openLeave = () => setLeaveOpen(true);

  const openAddTask = () => setAddTaskOpen(true);

  const closeAddTask = () => setAddTaskOpen(false);

  return (
    <div>
      {loading ? (
        <LoadingPage />
      ) : (
        <div>
          <h1>Group Page {gid}</h1>
          <button onClick={() => console.log(users)}>log</button>
          <button onClick={openAddTask}>Add Task</button>
          <button onClick={openAddUser}>Add new user</button>
          <button onClick={openLeave}>Leave Group</button>
          <GroupTaskList tasks={tasks} />
          <AddUserModal
            isOpen={addUserOpen}
            onRequestClose={closeAddUser}
            group={gid}
          />
          <LeaveGroupModal
            isOpen={leaveOpen}
            onRequestClose={onLeaveCancel}
            gid={gid}
          />
          <AddTaskModal
            isOpen={addTaskOpen}
            onRequestClose={closeAddTask}
            gid={gid}
            groupModule={group.module}
            addGroupTask={addGroupTask}
          />
        </div>
      )}
    </div>
  );
};

const mapStateToProps = state => ({
  groups: state.groups,
  userGroups: state.user.groups
});

export default connect(mapStateToProps)(GroupPage);
