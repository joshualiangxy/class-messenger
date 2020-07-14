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
      <label
        className={pick ? 'user-select user-select--picked' : 'user-select'}
      >
        <input
          className="user-select__checkbox"
          type="checkbox"
          checked={pick}
          onChange={togglePick}
        />
        {displayName}
      </label>
    </div>
  );
};

export default UserListItem;
