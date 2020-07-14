import React from 'react';
import UserListItem from './UserListItem';

const UserList = ({ users, removeUser, addUser, groupCompletedState }) => (
  <div className="user-list">
    {users.map(user => (
      <UserListItem
        key={user.uid}
        user={user}
        removeUser={removeUser}
        addUser={addUser}
        initialPick={groupCompletedState.hasOwnProperty(user.uid)}
      />
    ))}
  </div>
);

export default UserList;
