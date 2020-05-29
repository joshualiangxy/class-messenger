import database from '../firebase/firebase';

export const setUserData = (dname, snum) => ({
  type: 'SET_USER_DATA',
  dname,
  snum
});

export const startSetUserData = (displayName, studentNum) => {
  return (dispatch, getState) => {
    const uid = getState().auth.user.uid;

    return database
      .collection('users')
      .doc(`${uid}`)
      .set({ dname: displayName, snum: studentNum })
      .then(() => dispatch(setUserData(displayName, studentNum)));
  };
};
