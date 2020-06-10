import firebase from '../firebase/firebase';

export const getUserData = (displayName, studentNum) => ({
  type: 'GET_USER_DATA',
  displayName,
  studentNum
});

export const startGetUserData = () => {
  return (dispatch, getState) => {
    const uid = getState().auth.user.uid;

    return firebase
      .firestore()
      .collection('users')
      .doc(uid)
      .get()
      .then(snapshot => {
        const displayName = snapshot.data().displayName;
        const studentNum = snapshot.data().studentNum;
        dispatch(getUserData(displayName, studentNum));
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

    return firebase
      .firestore()
      .collection('users')
      .doc(uid)
      .set({ displayName, studentNum })
      .then(() => dispatch(setUserData(displayName, studentNum)));
  };
};

export const newUser = () => ({ type: 'NEW_USER' });

export const startNewUser = () => {
  return (dispatch, getState) => {
    const uid = getState().auth.user.uid;
    const email = getState().auth.user.email;

    return firebase
      .firestore()
      .collection('emailToUid')
      .doc(email)
      .set({ uid })
      .then(() => dispatch(newUser()));
  };
};
