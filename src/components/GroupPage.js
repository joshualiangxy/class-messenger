import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import AddUserModal from './AddUserModal';
import LeaveGroupModal from './LeaveGroupModal';
import { getAllUsers } from '../actions/groups';
import AddTaskModal from './AddTaskModal';

const GroupPage = ({ match, groups }) => {
  const gid = match.params.id;
  const group = groups.find(group => group.gid === gid);
  // var isAuthenticated = props.groups.includes(groupId); // Not working yet because groups haven't been stored yet
  var isAuthenticated = true; // TODO: Remove this once isAuthenticated works properly. For now, anyone can go to any group.
  // var isAdmin = true; // Not used right now, but may be useful to store it here for any admin operations later.

  // For Modal
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [users, setUsers] = useState([]);
  
  // TODO: Add the authentication under useEffect.
  // This may need us to add a new field for the object returned, because I don't want to go through every user object to check if an id is there. 
  useEffect(() => {
    (getAllUsers(gid).then(result => setUsers(result)));
  }, [gid]);

  const closeAddUser = () => setAddUserOpen(false);

  const openAddUser = () => setAddUserOpen(true);

  const onLeaveCancel = () => setLeaveOpen(false);

  const openLeave = () => setLeaveOpen(true);

  const openAddTask = () => setAddTaskOpen(true);

  const closeAddTask = () => setAddTaskOpen(false);

  return isAuthenticated ? (
    <div>
      <h1>Group Page {gid}</h1>
      <button onClick={() => console.log(users)}>log</button>
      <button onClick={openAddTask}>Add Task</button>
      <button onClick={openAddUser}>Add new user</button>
      <button onClick={openLeave}>Leave Group</button>
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
      />
    </div>
  ) : (
    <div>
      <h1>You are not in this group</h1>
    </div>
  );
};

const mapStateToProps = state => ({ groups: state.groups });

export default connect(mapStateToProps)(GroupPage);
