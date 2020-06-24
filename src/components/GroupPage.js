import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import LoadingPage from './LoadingPage';
import GroupSettingsModal from './GroupSettingsModal';
import LeaveGroupModal from './LeaveGroupModal';
import AddTaskModal from './AddTaskModal';
import GroupTaskList from './GroupTaskList';
import { getAllUsers } from '../actions/groups';
import { getAllGroupTasks } from '../actions/tasks';
import { history } from '../routers/AppRouter';

const GroupPage = ({
  gid,
  groupName,
  groupModule,
  authorised,
  uid,
  getAllUsers,
  getAllGroupTasks
}) => {
  // For Modal
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true);  

  useEffect(() => {
    if (!authorised) history.push('/groups');
    else {
      const promises = [];
      promises.push(
        getAllUsers(gid).then(users => {
          users.sort((userOne, userTwo) =>
            userOne.displayName.localeCompare(userTwo.displayName)
          );
          setUsers(users);
        })
      );
      promises.push(getAllGroupTasks(gid).then(tasks => setTasks(tasks)));
      Promise.all(promises).then(() => setLoading(false));
    }
  }, [gid, authorised, getAllUsers, getAllGroupTasks]);

  useEffect(() => {
    if (users.length > 0) setAdmin(users.find(user => user.uid === uid).admin);
  }, [users, uid]);

  const addGroupTask = task => setTasks([...tasks, task]);

  const editGroupTask = (id, updates) =>
    setTasks(tasks.map(task => (task.id === id ? updates : task)));

  const removeGroupTask = id => setTasks(tasks.filter(task => task.id !== id));

  const toggleGroupTaskComplete = id => {
    setTasks(
      tasks.map(task => {
        if (task.id === id) task.completed[uid] = !task.completed[uid];
        return task;
      })
    );
  };

  const closeAddUser = () => setAddUserOpen(false);

  const openAddUser = () => setAddUserOpen(true);

  const onLeaveCancel = () => setLeaveOpen(false);

  const openLeave = () => setLeaveOpen(true);

  const openAddTask = () => setAddTaskOpen(true);

  const closeAddTask = () => setAddTaskOpen(false);

  const renderLoad = () => setLoading(true);

  return (
    <div>
      {loading ? (
        <LoadingPage />
      ) : (
        <div>
          <h1>{groupName}</h1>
          {admin && (
            <div>
              <button onClick={openAddTask}>Add Task</button>
              <button onClick={openAddUser}>Group Settings</button>
            </div>
          )}
          <button onClick={openLeave}>Leave Group</button>
          <GroupTaskList
            tasks={tasks}
            users={users}
            admin={admin}
            groupName={groupName}
            editGroupTask={editGroupTask}
            removeGroupTask={removeGroupTask}
            toggleGroupTaskComplete={toggleGroupTaskComplete}
          />
          <GroupSettingsModal
            isOpen={addUserOpen}
            onRequestClose={closeAddUser}
            group={gid}
            users={users}
            setUsers={setUsers}
            admin={admin}
          />
          <LeaveGroupModal
            isOpen={leaveOpen}
            onRequestClose={onLeaveCancel}
            gid={gid}
            users={users}
            renderLoad={renderLoad}
            uid={uid}
            admin={admin}
          />
          <AddTaskModal
            isOpen={addTaskOpen}
            onRequestClose={closeAddTask}
            gid={gid}
            groupModule={groupModule}
            groupName={groupName}
            addGroupTask={addGroupTask}
            users={users}
          />
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state, { match }) => {
  const gid = match.params.id;
  const group = state.groups.find(group => group.gid === gid);
  const authorised = !!state.user.groups.find(id => id === gid);

  return {
    gid,
    groupName: group.name,
    groupModule: group.module,
    authorised,
    uid: state.auth.user.uid
  };
};

const mapDispatchToProps = (dispatch, { match }) => {
  const gid = match.params.id;

  return {
    getAllUsers: () => dispatch(getAllUsers(gid)),
    getAllGroupTasks: () => dispatch(getAllGroupTasks(gid))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupPage);
