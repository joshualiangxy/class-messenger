import { firebase, googleAuthProvider } from '../firebase/firebase';
import { removeUserData } from './user';
import { removeTaskData } from './tasks';

export const login = user => ({
  type: 'LOGIN',
  user
});

export const startLogin = () => {
  return () => firebase.auth().signInWithPopup(googleAuthProvider);
};

export const logout = () => ({ type: 'LOGOUT' });

export const startLogout = () => {
  return dispatch =>
    firebase
      .auth()
      .signOut()
      .then(() => {
        dispatch(removeUserData());
        dispatch(removeTaskData());
      });
};
