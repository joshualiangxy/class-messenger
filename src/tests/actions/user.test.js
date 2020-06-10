import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
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
  doc,
  get,
  resetFirestore,
  set,
  snapshot
} from '../__mocks__/firestore.mock';
import firebase from '../../firebase/firebase';
import user from '../fixtures/user';

const uid = 'testuid';
const email = 'abc@123';
const createMockStore = configureMockStore([thunk]);
const displayName = user.displayName;
const studentNum = user.studentNum;
let store;
firebase.firestore = firestore;

beforeEach(() => {
  store = createMockStore({
    auth: {
      user: { uid, email }
    }
  });
  resetFirestore();
});

describe('get user data', () => {
  test('should generate action object', () => {
    return expect(getUserData(displayName, studentNum)).toEqual({
      type: 'GET_USER_DATA',
      displayName,
      studentNum
    });
  });

  test('should get data from firebase', () =>
    store.dispatch(startGetUserData()).then(() => {
      const actions = store.getActions();

      expect(firestore).toHaveBeenCalledTimes(1);
      expect(collection).toHaveBeenCalledTimes(1);
      expect(collection).toHaveBeenCalledWith('users');
      expect(doc).toHaveBeenCalledTimes(1);
      expect(doc).toHaveBeenCalledWith(uid);
      expect(get).toHaveBeenCalledTimes(1);
      expect(snapshot.data).toHaveBeenCalledTimes(2);
      expect(actions[0]).toEqual(getUserData(displayName, studentNum));
    }));
});

describe('remove user data', () => {
  test('should generate action object', () =>
    expect(removeUserData()).toEqual({ type: 'REMOVE_USER_DATA' }));
});

describe('set user data', () => {
  test('should generate action object', () =>
    expect(setUserData(displayName, studentNum)).toEqual({
      type: 'SET_USER_DATA',
      displayName,
      studentNum
    }));

  test('should set data in firebase', () =>
    store.dispatch(startSetUserData(displayName, studentNum)).then(() => {
      const actions = store.getActions();

      expect(firestore).toHaveBeenCalledTimes(1);
      expect(collection).toHaveBeenCalledTimes(1);
      expect(collection).toHaveBeenCalledWith('users');
      expect(doc).toHaveBeenCalledTimes(1);
      expect(doc).toHaveBeenCalledWith(uid);
      expect(set).toHaveBeenCalledTimes(1);
      expect(set).toHaveBeenCalledWith({
        displayName,
        studentNum
      });
      expect(actions[0]).toEqual(setUserData(displayName, studentNum));
    }));
});

describe('new user', () => {
  test('should generate action object', () =>
    expect(newUser()).toEqual({ type: 'NEW_USER' }));

  test('should add emailToUid document', () =>
    store.dispatch(startNewUser()).then(() => {
      const actions = store.getActions();

      expect(firestore).toHaveBeenCalledTimes(1);
      expect(collection).toHaveBeenCalledTimes(1);
      expect(collection).toHaveBeenCalledWith('emailToUid');
      expect(doc).toHaveBeenCalledTimes(1);
      expect(doc).toHaveBeenCalledWith(email);
      expect(set).toHaveBeenCalledTimes(1);
      expect(set).toHaveBeenCalledWith({ uid });
      expect(actions[0]).toEqual(newUser());
    }));
});
