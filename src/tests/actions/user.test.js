import createMockStore from '../../setupTests';
import user from '../fixtures/user';
import firebase from '../../firebase/firebase';
import firestore, { collection } from '../__mocks__/firestore.mock';
import {
  emailToUidDoc,
  emailToUidDocSet
} from '../__mocks__/firestore/emailToUid';
import {
  userDoc,
  userDocGet,
  userDocSet,
  userDocSnapshotGet
} from '../__mocks__/firestore/users';
import {
  getUserData,
  startGetUserData,
  removeUserData,
  setUserData,
  startSetUserData,
  newUser,
  startNewUser
} from '../../actions/user';

firebase.firestore = firestore;

const uid = 'testuid';
const email = 'abc@123';
const displayName = user.displayName;
const studentNum = user.studentNum;
const groups = user.groups;
const store = createMockStore({
  auth: {
    user: { uid, email }
  }
});

beforeEach(() => {
  jest.clearAllMocks();
  store.clearActions();
});

describe('get user data', () => {
  it('should generate action object', () =>
    expect(getUserData(displayName, studentNum)).toEqual({
      type: 'GET_USER_DATA',
      displayName,
      studentNum
    }));

  it('should get data from firestore', () =>
    store.dispatch(startGetUserData()).then(() => {
      const actions = store.getActions();

      expect(firestore).toHaveBeenCalledTimes(1);

      expect(collection).toHaveBeenCalledTimes(1);
      expect(collection).toHaveBeenLastCalledWith('users');

      expect(userDoc).toHaveBeenCalledTimes(1);
      expect(userDoc).toHaveBeenLastCalledWith(uid);

      expect(userDocGet).toHaveBeenCalledTimes(1);

      expect(userDocSnapshotGet).toHaveBeenCalledTimes(3);
      expect(userDocSnapshotGet).toHaveBeenNthCalledWith(1, 'displayName');
      expect(userDocSnapshotGet).toHaveBeenNthCalledWith(2, 'studentNum');
      expect(userDocSnapshotGet).toHaveBeenNthCalledWith(3, 'groups');

      expect(actions).toHaveLength(1);
      expect(actions[0]).toEqual(getUserData(displayName, studentNum, groups));
    }));
});

describe('remove user data', () => {
  it('should generate action object', () =>
    expect(removeUserData()).toEqual({ type: 'REMOVE_USER_DATA' }));
});

describe('set user data', () => {
  it('should generate action object', () =>
    expect(setUserData(displayName, studentNum)).toEqual({
      type: 'SET_USER_DATA',
      displayName,
      studentNum
    }));

  it('should set data in firestore', () =>
    store.dispatch(startSetUserData(displayName, studentNum)).then(() => {
      const actions = store.getActions();

      expect(firestore).toHaveBeenCalledTimes(1);

      expect(collection).toHaveBeenCalledTimes(1);
      expect(collection).toHaveBeenLastCalledWith('users');

      expect(userDoc).toHaveBeenCalledTimes(1);
      expect(userDoc).toHaveBeenLastCalledWith(uid);

      expect(userDocSet).toHaveBeenCalledTimes(1);
      expect(userDocSet).toHaveBeenLastCalledWith({
        displayName,
        studentNum
      });

      expect(actions).toHaveLength(1);
      expect(actions[0]).toEqual(setUserData(displayName, studentNum));
    }));
});

describe('new user', () => {
  it('should generate action object', () =>
    expect(newUser()).toEqual({ type: 'NEW_USER' }));

  it('should add emailToUid document', () =>
    store.dispatch(startNewUser()).then(() => {
      const actions = store.getActions();

      expect(firestore).toHaveBeenCalledTimes(1);

      expect(collection).toHaveBeenCalledTimes(1);
      expect(collection).toHaveBeenLastCalledWith('emailToUid');

      expect(emailToUidDoc).toHaveBeenCalledTimes(1);
      expect(emailToUidDoc).toHaveBeenLastCalledWith(email);

      expect(emailToUidDocSet).toHaveBeenCalledTimes(1);
      expect(emailToUidDocSet).toHaveBeenLastCalledWith({ uid, groups: [] });

      expect(actions).toHaveLength(1);
      expect(actions[0]).toEqual(newUser());
    }));
});
