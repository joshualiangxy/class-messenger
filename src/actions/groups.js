import firebase, { firestore } from '../firebase/firebase';
import { v4 as uuid } from 'uuid';
import { addGroup, removeGroup } from './user';
import { startRemoveDownloadURL } from './tasks';
import { startRemoveUserFile } from './files';

export const newGroup = (name, groupId, module) => ({
  type: 'NEW_GROUP',
  name,
  groupId,
  module
});

// Should return a promise of both adding a user to the group and adding a group to a user.
export const startNewGroup = (groupName, module) => {
  return (dispatch, getState) => {
    const uid = getState().auth.user.uid;
    const gid = uuid();
    const userRef = firestore.collection('users').doc(uid);
    const groupRef = firestore.collection('groups').doc(gid);

    const userPromise = userRef.update({
      groups: firebase.firestore.FieldValue.arrayUnion(gid)
    });
    const groupPromise = groupRef.set({
      name: groupName,
      module
    });
    const groupUserPromise = groupRef.collection('users').doc(uid).set({
      uid: uid,
      displayName: getState().user.displayName,
      studentNum: getState().user.studentNum,
      admin: true
    });

    return Promise.all([userPromise, groupPromise, groupUserPromise]).then(
      () => {
        dispatch(newGroup(groupName, gid, module));
        dispatch(addGroup(gid));
      }
    );
  };
};

export const addNewUser = (user, gid) => {
  // Note: No checking on this side, since only valid users can be added by getUser
  // Add user to group
  const groupPromise = firestore
    .collection('groups')
    .doc(gid)
    .collection('users')
    .doc(user.uid)
    .set({
      displayName: user.displayName,
      studentNum: user.studentNum,
      uid: user.uid,
      admin: false
    });
  // Add group to user's groups array.
  const userPromise = firestore
    .collection('users')
    .doc(user.uid)
    .update({
      groups: firebase.firestore.FieldValue.arrayUnion(gid)
    });
  return Promise.all([groupPromise, userPromise]);
};

export const setGroups = groups => ({ type: 'SET_GROUPS', groups });

export const startSetGroups = () => {
  const groups = []; // The array of objects to be pushed
  return (dispatch, getState) => {
    return firestore
      .collection('users')
      .doc(getState().auth.user.uid)
      .get()
      .then(userSnapshot => {
        // Get the array of all groups this user is in, and dispatch it to the store.
        const groupIds = userSnapshot.data().groups || []; // Array of group id, or empty array.
        const promises = [];

        groupIds.forEach(gid => {
          promises.push(
            firestore
              .collection('groups')
              .doc(gid)
              .get()
              .then(snapshot => {
                groups.push({
                  name: snapshot.get('name'),
                  gid,
                  module: snapshot.get('module') || ''
                });
              })
          );
        });

        return Promise.all(promises);
      })
      .then(() => dispatch(setGroups(groups)))
  };
};

export const leaveGroup = gid => ({
  type: 'LEAVE_GROUP',
  gid
});

export const startLeaveGroup = (gid, count) => {
  return (dispatch, getState) => {
    const uid = getState().auth.user.uid;
    const groupRef = firestore.collection('groups').doc(gid);

    // Promises
    const userPromise = firestore
      .collection('users')
      .doc(uid)
      .update({
        groups: firebase.firestore.FieldValue.arrayRemove(gid)
      }); // Remove this group from the user's groups.
    const groupPromise = groupRef.collection('users').doc(uid).delete(); // Remove the user document from this group
    const tasksPromise = groupRef
      .collection('tasks')
      .get()
      .then(query => {
        const promises = [];
        query.forEach(doc => {
          const update = {};
          update[`completed.${uid}`] = firebase.firestore.FieldValue.delete();
          doc.ref.update(update).then(() => {
            if (doc.get('uploadRequired')) {
              // Removes the user's files from the group's tasks
              promises.push(dispatch(startRemoveDownloadURL(doc.id, gid, uid)));
              promises.push(dispatch(startRemoveUserFile(doc.id, uid)));
            }
          });
        });
        return Promise.all(promises);
      });
    return Promise.all([userPromise, groupPromise, tasksPromise])
      .then(() => {
        if (count <= 1) {
          // This is for the case where the user is alone, and only this case, so there shouldn't be
          // any risk of deleting a group someone else is in. Unless someone decides to multi-tab this to break the system.
          // However, this problem can also be solved if we do an additional database-check to ensure there aren't any users left.
          // The count includes the current user.

          // Deletes all of the documents under the users collection.
          const usersPromise = groupRef
            .collection('users')
            .get()
            .then(snapshot => {
              snapshot.forEach(doc => doc.ref.delete());
            });
          // Deletes all of the documents under the tasks collection.
          const tasksPromise = groupRef
            .collection('tasks')
            .get()
            .then(snapshot => {
              snapshot.forEach(doc => doc.ref.delete());
            });
          return Promise.all([usersPromise, tasksPromise]).then(() =>
            groupRef.delete()
          );
        } else {
          return;
        }
      })
      .then(() => {
        dispatch(leaveGroup(gid));
        dispatch(removeGroup(gid));
      });
  };
};

export const getUser = email => {
  // Get UID from email
  return firestore
    .collection('emailToUid')
    .doc(email)
    .get()
    .then(uidDoc => {
      if (uidDoc.exists) {
        // If this user exists, find the UID associated
        return firestore
          .collection('users')
          .doc(uidDoc.data().uid)
          .get()
          .then(userDoc => {
            // Then return an object containing the user's name and number
            return {
              displayName: userDoc.data().displayName,
              studentNum: userDoc.data().studentNum,
              uid: userDoc.ref.id
            };
          });
      } else {
        return undefined;
      }
    });
};

// Not to be confused with getUser, this one is for all the users in a group.
export const getAllUsers = gid => {
  return () =>
    firestore
      .collection('groups')
      .doc(gid)
      .collection('users')
      .get()
      .then(query => {
        const result = [];
        query.forEach(doc => {
          result.push(doc.data());
        });
        return result;
      });
};

export const kickUser = (user, gid) => {
  return dispatch => {
    // user is a user object, group is gid
    // Since users aren't stored inside the store, no need to dispatch
    const uid = user.uid;
    // Remove this user from the group's collection of users
    const groupPromise = firestore
      .collection('groups')
      .doc(gid)
      .collection('users')
      .doc(uid)
      .delete();
    // Remove this group from the user's groups
    const userPromise = firestore
      .collection('users')
      .doc(uid)
      .update({
        groups: firebase.firestore.FieldValue.arrayRemove(gid)
      });
    // Remove the user from any tasks
    const tasksPromise = firestore
      .collection('groups')
      .doc(gid)
      .collection('tasks')
      .get()
      .then(query => {
        const promises = [];
        query.forEach(doc => {
          // doc = QueryDocumentSnapshot

          const update = {};
          update[`completed.${uid}`] = firebase.firestore.FieldValue.delete();
          //const completed = doc.get('completed'); // Object of {${uid}: boolean}
          //delete completed[uid];
          doc.ref.update(update).then(() => {
            if (doc.get('uploadRequired')) {
              promises.push(dispatch(startRemoveDownloadURL(doc.id, gid, uid)));
              promises.push(dispatch(startRemoveUserFile(doc.id, uid)));
            }
          });
        });

        return Promise.all(promises);
      })
    return Promise.all([groupPromise, userPromise, tasksPromise]);
  };
};

export const promoteUser = (user, gid) => {
  const uid = user.uid;

  return firestore
    .collection('groups')
    .doc(gid)
    .collection('users')
    .doc(uid)
    .update({
      admin: true
    });
};
export const demoteUser = (user, gid) => {
  const uid = user.uid;

  return firestore
    .collection('groups')
    .doc(gid)
    .collection('users')
    .doc(uid)
    .update({
      admin: false
    });
};

// Returns a promise of a boolean (admin status of this user) to chain inside GroupSettingsModal
export const recheckAdmin = (uid, gid) => {
  // Checks if the current user is an admin of a group
  return firebase
    .firestore()
    .collection('groups')
    .doc(gid)
    .collection('users')
    .doc(uid)
    .get()
    .then(snapshot => snapshot.get('admin'));
};
