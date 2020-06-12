import firebase from '../firebase/firebase';
import { v4 as uuid } from 'uuid';

export const newGroup = name => ({
  type: 'NEW_GROUP',
  name
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
    return Promise.all([userPromise, groupPromise, groupUserPromise]);
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
            // Deprecated, since there's already the check in emailToUid. 
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
