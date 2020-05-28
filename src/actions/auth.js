import { firebase, googleAuthProvider } from '../firebase/firebase';

export const login = user => ({
  type: 'LOGIN',
  user
});

export const startLogin = () => {
  return () => firebase.auth().signInWithPopup(googleAuthProvider);
};

export const logout = () => ({ type: 'LOGOUT' });

export const startLogout = () => {
  return () => firebase.auth().signOut();
};
