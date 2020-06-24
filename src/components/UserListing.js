import React from 'react';
import { kickUser, promoteUser, demoteUser } from '../actions/groups';

/**
 * This component is used for GroupSettingsModal to display the
 * list of users, as well as the respective buttons for kicking
 * or editing.
 */
const UserListing = ({ users, setUsers, group, admin }) => {
  const onKick = (user, group) => {
    // Remove from users
    kickUser(user, group)
      .then(() => setUsers(users.filter(u => u.studentNum !== user.studentNum)))
      .catch(error => console.log(error));
  };

  const onPromote = (user, group) => {
    promoteUser(user, group).then(() => {
      setUsers(
        users.map(u =>
          u.studentNum === user.studentNum ? { ...u, admin: true } : u
        )
      );
    });
  };
  const onDemote = (user, group) => {
    demoteUser(user, group).then(() => {
      setUsers(
        users.map(u =>
          u.studentNum === user.studentNum ? { ...u, admin: false } : u
        )
      );
    });
  };

  // The other buttons can only be seen if the current user is an admin.
  return users.map(user => (
    <div key={user.studentNum}>
      {user.displayName}{' '}
      {admin && !user.admin && (
        <button onClick={() => onPromote(user, group)}>Make admin</button>
      )}{' '}
      {admin && user.admin && (
        <button onClick={() => onDemote(user, group)}>Demote admin</button>
      )}
      {admin && <button onClick={() => onKick(user, group)}>Kick</button>}
    </div>
  ));
};

export default UserListing;
