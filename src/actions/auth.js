import { auth, googleAuthProvider } from '../firebase/firebase';
import { history } from '../routers/AppRouter';
import { removeUserData } from './user';
import { removeTaskData } from './tasks';

export const login = user => ({
  type: 'LOGIN',
  user
});

export const startLogin = () => {
  return () => auth.signInWithPopup(googleAuthProvider);
};

export const logout = () => ({ type: 'LOGOUT' });

export const startLogout = () => {
  return dispatch =>
    auth.signOut().then(() => {
      history.push('/');
      dispatch(removeUserData());
      dispatch(removeTaskData());
    });
};
