import firebase from '../firebase/firebase';
import { v4 as uuid } from 'uuid';

export const newGroup = (name, groupId) => ({
  type: 'NEW_GROUP',
  name,
  groupId
});

// Should return a promise of both adding a user to the group and adding a group to a user.
export const startNewGroup = groupName => {
  return (dispatch, getState) => {
    const uid = getState().auth.user.uid;
    const groupUUID = uuid();
    const userRef = firebase.firestore().collection('users').doc(uid);
    const groupRef = firebase.firestore().collection('groups').doc(groupUUID);

    // Not sure why but database.FieldValue doesn't work but this still does the job
    const userPromise = userRef.update({
      groups: firebase.firestore.FieldValue.arrayUnion(groupUUID)
    });
    const groupPromise = groupRef
      .set({
        name: groupName
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
      dispatch(newGroup())
    );
  };
};

export const addNewUser = (userEmail, group, setError) => {
  firebase
    .firestore()
    .collection('emailToUid')
    .doc(userEmail)
    .get()
    .then(uidDoc => {
      const uidData = uidDoc.data();
      if (typeof uidData === 'undefined') {
        // This data doesn't exist / Invalid user
        setError('No user found');
      } else {
        // Both of these references are DocumentReference
        const userRef = firebase
          .firestore()
          .collection('users')
          .doc(uidData.uid);
        const groupRef = firebase.firestore().collection('groups').doc(group);
        const uid = uidData.uid;

        // Gets the data from a user.
        userRef.get().then(doc => {
          const data = doc.data();
          // Write displayName, studentNum, and UID into a new document
          if (typeof data === 'undefined') {
            // Most likely a user that doesn't exist.
            // Redundant, since there's already the check in emailToUid.
            setError('No such user found');
          } else {
            groupRef
              .collection('users')
              .doc(uid) // Create document for this user's UID
              .set({
                studentNum: data.studentNum,
                displayName: data.displayName,
                uid: uid,
                admin: false
              })
              .then(() => {
                setError('User added!');
              })
              .catch(error => {
                setError('Something went wrong.');
              });
          }
        });
      }
      // Defaults to non-admin.
    });
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
                  name: snapshot.data().name,
                  gid
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

export const startLeaveGroup = gid => {
  // TODO: not working yet, probably has to do with where this is called in GroupPage
  return (dispatch, getState) => {
    const uid = getState().auth.user.uid;
    const userRef = firebase.firestore().collection('users').doc(uid);
    const groupUserRef = firebase
      .firestore()
      .collection('groups')
      .doc(gid)
      .collection('users')
      .doc(uid);
    const userPromise = userRef.update({
      groups: firebase.firestore.FieldValue.arrayRemove(gid)
    }); // Removes this group from the user's group list
    const groupUserPromise = groupUserRef.delete(); // Removes the user from the group
    return Promise.all([userPromise, groupUserPromise]).then(() =>
      dispatch(leaveGroup(gid))
    );
  };
};
