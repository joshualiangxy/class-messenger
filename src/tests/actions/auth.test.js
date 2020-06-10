import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import firebase, { googleAuthProvider } from '../../firebase/firebase';
import auth, {
  signInWithPopup,
  signOut,
  resetAuth
} from '../__mocks__/firebase.auth.mock';
import { login, startLogin, logout, startLogout } from '../../actions/auth';
import { removeUserData } from '../../actions/user';
import { removeTaskData } from '../../actions/tasks';

const createMockStore = configureMockStore([thunk]);
const store = createMockStore({});
firebase.auth = auth;

beforeEach(() => resetAuth());

describe('login', () => {
  test('should generate login action object', () => {
    const user = { uid: '123', email: 'abc@123' };
    expect(login(user)).toEqual({ type: 'LOGIN', user });
  });

  test('should sign in with google auth provider', () =>
    store.dispatch(startLogin()).then(() => {
      expect(auth).toHaveBeenCalledTimes(1);
      expect(signInWithPopup).toHaveBeenCalledTimes(1);
      expect(signInWithPopup).toHaveBeenCalledWith(googleAuthProvider);
    }));
});

describe('logout', () => {
  test('should generate logout action object', () =>
    expect(logout()).toEqual({ type: 'LOGOUT' }));

  test('should log user out and remove user and task data', () =>
    store.dispatch(startLogout()).then(() => {
      const actions = store.getActions();

      expect(auth).toHaveBeenCalledTimes(1);
      expect(signOut).toHaveBeenCalledTimes(1);
      expect(actions[0]).toEqual(removeUserData());
      expect(actions[1]).toEqual(removeTaskData());
    }));
});
