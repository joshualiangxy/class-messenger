import React, { useState } from 'react';

const UserListItem = ({ user, removeUser, addUser, initialPick }) => {
  const { displayName, uid } = user;
  const [pick, setPick] = useState(initialPick);

  const togglePick = () => {
    setPick(!pick);
    if (pick) removeUser(uid);
    else addUser(uid);
  };

  return (
    <div>
      <input type="checkbox" checked={pick} onChange={togglePick} />
      <h3>{displayName}</h3>
    </div>
  );
};

export default UserListItem;
