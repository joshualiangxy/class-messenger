import createMockStore from '../../setupTests';
import { googleAuthProvider } from '../../firebase/firebase';
import { signInWithPopup, signOut } from '../__mocks__/firebase/auth';
import { login, startLogin, logout, startLogout } from '../../actions/auth';
import { removeUserData } from '../../actions/user';
import { removeTaskData } from '../../actions/tasks';

jest.mock('firebase');

const store = createMockStore({});

beforeEach(() => {
  jest.clearAllMocks();
  store.clearActions();
});

describe('login', () => {
  it('should generate login action object', () => {
    const user = { uid: '123', email: 'abc@123' };
    expect(login(user)).toEqual({ type: 'LOGIN', user });
  });

  it('should sign in with google auth provider', () =>
    store.dispatch(startLogin()).then(() => {
      expect(signInWithPopup).toHaveBeenCalledTimes(1);
      expect(signInWithPopup).toHaveBeenLastCalledWith(googleAuthProvider);
    }));
});

describe('logout', () => {
  it('should generate logout action object', () =>
    expect(logout()).toEqual({ type: 'LOGOUT' }));

  it('should log user out and remove user and task data', () =>
    store.dispatch(startLogout()).then(() => {
      const actions = store.getActions();

      expect(signOut).toHaveBeenCalledTimes(1);

      expect(actions).toHaveLength(2);
      expect(actions[0]).toEqual(removeUserData());
      expect(actions[1]).toEqual(removeTaskData());
    }));
});
