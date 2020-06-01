import database from '../firebase/firebase';
import {v4 as uuid} from 'uuid';

export const newGroup = (name) => ({
  type: 'NEW_GROUP',
  name
})

export const startNewGroup = (groupName) => {
  return (dispatch, getState) => {
    const uid = getState().auth.user.uid;
    const groupUUID = uuid();
    const userDocRef = database.collection('users').doc(uid);
    const groupRef = database.collection('groups').doc(groupUUID);
    
    return Promise.all([
      () => userDocRef.collection('groups')
      .doc(groupUUID).set({
        name: groupName,
        ref: groupRef
      }),
      () => groupRef.doc('users').update({
         [uid]: userDocRef
       })
    ])   
    
  }
}