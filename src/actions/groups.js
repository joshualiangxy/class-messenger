import database from '../firebase/firebase';
import firebase from 'firebase';

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
    const userRef = database.collection('users').doc(uid);
    const groupRef = database.collection('groups').doc(groupUUID);

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
      name: getState().user.displayName,
      admin: true
    });
    return Promise.all([userPromise, groupPromise, groupUserPromise]);
  };
};


export const addNewUser = (userEmail, group) => {
  const uid = userEmail; // Change this when email-uid are linked!
  const groupRef = database.collection('groups').doc(group); 
  const userRef = database.collection('users').doc(uid);
  if (userRef.exists) {
    // Create a new document for this user. Non-admin by default, implement promotion later
    const userProperties = {};
    userRef.get().then(snapshot => {
      userProperties.name = snapshot.displayName;
      userProperties.sNum = snapshot.studentNum;
    }).catch(() => {console.log("caught")});
  } 
}