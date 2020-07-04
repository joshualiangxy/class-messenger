import React from 'react';
import { connect } from 'react-redux';
import {
  kickUser,
  promoteUser,
  demoteUser,
  recheckAdmin
} from '../actions/groups';

/**
 * This component is used for GroupSettingsModal to display the
 * list of users, as well as the respective buttons for kicking
 * or editing.
 */
const GroupUserListing = ({
  users,
  setUsers,
  group,
  admin,
  setAdmin,
  uid,
  kickUser,
  kickUserLocal,
  setError
}) => {
  const onKick = (user, group) => {
    // Remove from users
    recheckAdmin(uid, group).then(isAdmin => {
      if (isAdmin) {
        kickUser(user, group)
          .then(() => kickUserLocal(user.uid))
          .then(() => setUsers(users.filter(u => u.uid !== user.uid)))
          .catch(error => console.log(error));
      } else {
        setAdmin(false);
        setError('You are not an admin!')
      }
    });
  };

  const onPromote = (user, group) => {
    recheckAdmin(uid, group).then(isAdmin => {
      if (isAdmin) {
        promoteUser(user, group).then(() => {
          setUsers(
            users.map(u => (u.uid === user.uid ? { ...u, admin: true } : u))
          );
        });
      } else {
        setAdmin(false);
        setError('You are not an admin!')
      }
    });
  };

  const onDemote = (user, group) => {
    recheckAdmin(uid, group).then(isAdmin => {
      if (isAdmin) {
        demoteUser(user, group).then(() => {
          setUsers(
            users.map(u => (u.uid === user.uid ? { ...u, admin: false } : u))
          );
        });
      } else {
        setAdmin(false);
        setError('You are not an admin!')
      }
    });
  };

  // The other buttons can only be seen if the current user is an admin.
  return users.map(user => (
    <div key={user.uid}>
      {user.displayName} {user.uid === uid && '(You)'}{' '}
      {admin && !user.admin && (
        <button onClick={() => onPromote(user, group)}>Make admin</button>
      )}{' '}
      {admin && user.admin && user.uid !== uid && (
        <button onClick={() => onDemote(user, group)}>Demote admin</button>
      )}
      {admin && user.uid !== uid && (
        <button onClick={() => onKick(user, group)}>Kick</button>
      )}
    </div>
  ));
};

const mapDispatchToProps = dispatch => ({
  kickUser: (user, group) => dispatch(kickUser(user, group))
});

export default connect(undefined, mapDispatchToProps)(GroupUserListing);
