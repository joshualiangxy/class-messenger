import { firestore } from '../firebase/firebase';

export const getUserData = (displayName, studentNum, groups) => ({
  type: 'GET_USER_DATA',
  displayName,
  studentNum,
  groups
});

export const startGetUserData = () => {
  return (dispatch, getState) => {
    const uid = getState().auth.user.uid;

    return firestore
      .collection('users')
      .doc(uid)
      .get()
      .then(snapshot => {
        const displayName = snapshot.get('displayName');
        const studentNum = snapshot.get('studentNum');
        const groups = snapshot.get('groups');
        dispatch(getUserData(displayName, studentNum, groups));
      });
  };
};

export const removeUserData = () => ({ type: 'REMOVE_USER_DATA' });

export const setUserData = (displayName, studentNum) => ({
  type: 'SET_USER_DATA',
  displayName,
  studentNum
});

export const startSetUserData = (displayName, studentNum) => {
  return (dispatch, getState) => {
    const uid = getState().auth.user.uid;
    const userRef = firestore.collection('users').doc(uid);

    return userRef
      .get()
      .then(snapshot => {
        const groups = snapshot.get('groups');
        const promises = [];

        groups.forEach(gid => {
          const groupRef = firestore.collection('groups').doc(gid);

          promises.push(
            groupRef
              .collection('users')
              .doc(uid)
              .update({ displayName, studentNum })
          );
        });

        return Promise.all(promises);
      })
      .then(() =>
        userRef
          .update({ displayName, studentNum })
          .then(() => dispatch(setUserData(displayName, studentNum)))
      );
  };
};

export const newUser = () => ({ type: 'NEW_USER' });

export const startNewUser = () => {
  return (dispatch, getState) => {
    const uid = getState().auth.user.uid;
    const email = getState().auth.user.email.toLowerCase();
    const promises = [];

    promises.push(firestore.collection('emailToUid').doc(email).set({ uid }));
    promises.push(
      firestore
        .collection('users')
        .doc(uid)
        .set({ displayName: '', studentNum: '', groups: [] })
    );

    return Promise.all(promises).then(() => dispatch(newUser()));
  };
};

export const addGroup = gid => ({ type: 'ADD_GROUP', gid });

export const removeGroup = gid => ({ type: 'REMOVE_GROUP', gid });
