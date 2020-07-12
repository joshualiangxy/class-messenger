import createMockStore from '../../setupTests';
import user from '../fixtures/user';
import { collection } from '../__mocks__/firebase/firestore';
import {
  emailToUidDoc,
  emailToUidDocSet
} from '../__mocks__/firebase/firestore/emailToUid';
import {
  userDoc,
  userDocGet,
  userDocSet,
  userDocSnapshotGet,
  userDocUpdate
} from '../__mocks__/firebase/firestore/users';
import {
  getUserData,
  startGetUserData,
  removeUserData,
  setUserData,
  startSetUserData,
  newUser,
  startNewUser,
  addGroup,
  removeGroup
} from '../../actions/user';
import {
  groupOneDocCollection,
  groupOneUserDoc,
  groupOneUserDocUpdate
} from '../__mocks__/firebase/firestore/groupCollections/groupOne';
import { groupDoc } from '../__mocks__/firebase/firestore/groups';
import {
  groupTwoDocCollection,
  groupTwoUserDoc,
  groupTwoUserDocUpdate
} from '../__mocks__/firebase/firestore/groupCollections/groupTwo';
import {
  groupThreeDocCollection,
  groupThreeUserDoc,
  groupThreeUserDocUpdate
} from '../__mocks__/firebase/firestore/groupCollections/groupThree';

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

      expect(collection).toHaveBeenCalledTimes(4);
      expect(collection).toHaveBeenNthCalledWith(1, 'users');
      expect(collection).toHaveBeenNthCalledWith(2, 'groups');
      expect(collection).toHaveBeenNthCalledWith(3, 'groups');
      expect(collection).toHaveBeenNthCalledWith(4, 'groups');

      expect(userDoc).toHaveBeenCalledTimes(1);
      expect(userDoc).toHaveBeenLastCalledWith(uid);

      expect(userDocGet).toHaveBeenCalledTimes(1);

      expect(userDocSnapshotGet).toHaveBeenCalledTimes(1);
      expect(userDocSnapshotGet).toHaveBeenLastCalledWith('groups');

      expect(groupDoc).toHaveBeenCalledTimes(3);
      expect(groupDoc).toHaveBeenNthCalledWith(1, groups[0]);
      expect(groupDoc).toHaveBeenNthCalledWith(2, groups[1]);
      expect(groupDoc).toHaveBeenNthCalledWith(3, groups[2]);

      expect(groupOneDocCollection).toHaveBeenCalledTimes(1);
      expect(groupOneDocCollection).toHaveBeenLastCalledWith('users');

      expect(groupOneUserDoc).toHaveBeenCalledTimes(1);
      expect(groupOneUserDoc).toHaveBeenLastCalledWith(uid);

      expect(groupOneUserDocUpdate).toHaveBeenCalledTimes(1);
      expect(groupOneUserDocUpdate).toHaveBeenLastCalledWith({
        displayName,
        studentNum
      });

      expect(groupTwoDocCollection).toHaveBeenCalledTimes(1);
      expect(groupTwoDocCollection).toHaveBeenLastCalledWith('users');

      expect(groupTwoUserDoc).toHaveBeenCalledTimes(1);
      expect(groupTwoUserDoc).toHaveBeenLastCalledWith(uid);

      expect(groupTwoUserDocUpdate).toHaveBeenCalledTimes(1);
      expect(groupTwoUserDocUpdate).toHaveBeenLastCalledWith({
        displayName,
        studentNum
      });

      expect(groupThreeDocCollection).toHaveBeenCalledTimes(1);
      expect(groupThreeDocCollection).toHaveBeenLastCalledWith('users');

      expect(groupThreeUserDoc).toHaveBeenCalledTimes(1);
      expect(groupThreeUserDoc).toHaveBeenLastCalledWith(uid);

      expect(groupThreeUserDocUpdate).toHaveBeenCalledTimes(1);
      expect(groupThreeUserDocUpdate).toHaveBeenLastCalledWith({
        displayName,
        studentNum
      });

      expect(userDocUpdate).toHaveBeenCalledTimes(1);
      expect(userDocUpdate).toHaveBeenLastCalledWith({
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

  it('should add emailToUid document and set default fields', () =>
    store.dispatch(startNewUser()).then(() => {
      const actions = store.getActions();

      expect(collection).toHaveBeenCalledTimes(2);
      expect(collection).toHaveBeenNthCalledWith(1, 'emailToUid');
      expect(collection).toHaveBeenNthCalledWith(2, 'users');

      expect(emailToUidDoc).toHaveBeenCalledTimes(1);
      expect(emailToUidDoc).toHaveBeenLastCalledWith(email);

      expect(emailToUidDocSet).toHaveBeenCalledTimes(1);
      expect(emailToUidDocSet).toHaveBeenLastCalledWith({ uid });

      expect(userDoc).toHaveBeenCalledTimes(1);
      expect(userDoc).toHaveBeenLastCalledWith(uid);

      expect(userDocSet).toHaveBeenCalledTimes(1);
      expect(userDocSet).toHaveBeenLastCalledWith({
        displayName: '',
        studentNum: '',
        groups: []
      });

      expect(actions).toHaveLength(1);
      expect(actions[0]).toEqual(newUser());
    }));
});

describe('add group', () => {
  it('should generate action object', () =>
    expect(addGroup(groups[0])).toEqual({ type: 'ADD_GROUP', gid: groups[0] }));
});

describe('remove group', () => {
  it('should generate action object', () =>
    expect(removeGroup(groups[0])).toEqual({
      type: 'REMOVE_GROUP',
      gid: groups[0]
    }));
});
