import React from 'react';
import { connect } from 'react-redux';
import { kickUser, promoteUser, demoteUser } from '../actions/groups';

/**
 * This component is used for GroupSettingsModal to display the
 * list of users, as well as the respective buttons for kicking
 * or editing.
 */
const UserListing = ({ users, setUsers, group, admin, uid, kickUser }) => {
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

export default connect(undefined, mapDispatchToProps)(UserListing);
