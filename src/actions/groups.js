import firebase from '../firebase/firebase';
import { v4 as uuid } from 'uuid';
import { addGroup } from './user';

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
    const userRef = firebase.firestore().collection('users').doc(uid);
    const groupRef = firebase.firestore().collection('groups').doc(gid);

    const userPromise = userRef.update({
      groups: firebase.firestore.FieldValue.arrayUnion(gid)
    });
    const groupPromise = groupRef
      .set({
        name: groupName,
        module
      })
      .catch(error => {
        console.log(error);
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
  const groupPromise = firebase
    .firestore()
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
  const userPromise = firebase
    .firestore()
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
    firebase
      .firestore()
      .collection('users')
      .doc(getState().auth.user.uid)
      .get()
      .then(userSnapshot => {
        // Get the array of all groups this user is in, and dispatch it to the store.
        const groupIds = userSnapshot.data().groups || []; // Array of group id, or empty array.
        const promises = [];

        groupIds.forEach(gid => {
          promises.push(
            firebase
              .firestore()
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
      .catch(error => console.log(error));
  };
};

export const leaveGroup = gid => ({
  type: 'LEAVE_GROUP',
  gid
});

export const startLeaveGroup = (gid, count) => {
  return (dispatch, getState) => {
    const uid = getState().auth.user.uid;
    const groupRef = firebase.firestore().collection('groups').doc(gid);

    // Promises
    const userPromise = firebase
      .firestore()
      .collection('users')
      .doc(uid)
      .update({
        groups: firebase.firestore.FieldValue.arrayRemove(gid)
      }); // Remove this group from the user's groups.
    const groupPromise = groupRef.collection('users').doc(uid).delete(); // Remove the user document from this group
    return Promise.all([userPromise, groupPromise])
      .then(() => {
        if (count <= 1) {
          // This is for the case where the user is alone, and only this case, so there shouldn't be
          // any risk of deleting a group someone else is in. Unless someone decides to multi-tab this to break the system.
          // However, this problem can also be solved if we do an additional database-check to ensure there aren't any users left.
          // The count includes the current user.

          // This doesn't delete all the subcollections here, so users and tasks aren't deleted yet.
          // TODO: delete tasks collection when that part is implemented
          return groupRef.delete();
        } else {
          return;
        }
      })
      .then(() => dispatch(leaveGroup(gid)));
  };
};

export const getUser = email => {
  // Get UID from email
  return firebase
    .firestore()
    .collection('emailToUid')
    .doc(email)
    .get()
    .then(uidDoc => {
      if (uidDoc.exists) {
        // If this user exists, find the UID associated
        return firebase
          .firestore()
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
  return firebase
    .firestore()
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
