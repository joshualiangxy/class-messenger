import createMockStore from '../setupTests';
import user from '../fixtures/user';
import firebase from '../../firebase/firebase';
import {
  getUserData,
  startGetUserData,
  removeUserData,
  setUserData,
  startSetUserData,
  newUser,
  startNewUser
} from '../../actions/user';
import firestore, {
  collection,
  emailToUidDoc,
  emailToUidDocSet,
  userDoc,
  userDocGet,
  userDocSet,
  userDocSnapshotData,
  resetFirestore
} from '../__mocks__/firestore.mock';

firebase.firestore = firestore;

const uid = 'testuid';
const email = 'abc@123';
const displayName = user.displayName;
const studentNum = user.studentNum;
const store = createMockStore({
  auth: {
    user: { uid, email }
  }
});

beforeEach(() => {
  store.clearActions();
  resetFirestore();
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
      expect(collection).toHaveBeenCalledWith('users');

      expect(userDoc).toHaveBeenCalledTimes(1);
      expect(userDoc).toHaveBeenCalledWith(uid);

      expect(userDocGet).toHaveBeenCalledTimes(1);

      expect(userDocSnapshotData).toHaveBeenCalledTimes(2);

      expect(actions).toHaveLength(1);
      expect(actions[0]).toEqual(getUserData(displayName, studentNum));
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
      expect(collection).toHaveBeenCalledWith('users');

      expect(userDoc).toHaveBeenCalledTimes(1);
      expect(userDoc).toHaveBeenCalledWith(uid);

      expect(userDocSet).toHaveBeenCalledTimes(1);
      expect(userDocSet).toHaveBeenCalledWith({
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
      expect(collection).toHaveBeenCalledWith('emailToUid');

      expect(emailToUidDoc).toHaveBeenCalledTimes(1);
      expect(emailToUidDoc).toHaveBeenCalledWith(email);

      expect(emailToUidDocSet).toHaveBeenCalledTimes(1);
      expect(emailToUidDocSet).toHaveBeenCalledWith({ uid });

      expect(actions).toHaveLength(1);
      expect(actions[0]).toEqual(newUser());
    }));
});
