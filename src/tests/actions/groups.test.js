import createMockStore from '../../setupTests';
import {
  newGroup,
  startNewGroup,
  addNewUser,
  recheckAdmin,
  setGroups,
  startSetGroups,
  getUser,
  leaveGroup,
  startLeaveGroup
} from '../../actions/groups';
import user from '../fixtures/user';
import user2 from '../fixtures/user2';
import { v4 } from '../__mocks__/uuid';
import {
  collection,
  arrayUnionReturnValue,
  FieldValue,
  arrayRemoveReturnValue
} from '../__mocks__/firebase/firestore';
import { addGroup } from '../../actions/user';

jest.mock('firebase');

const displayName = 'tester';
const studentNum = 'A1234567E';
const uid = 'testuid';

const store = createMockStore({
  auth: {
    user: {
      uid
    }
  },
  user: {
    displayName,
    studentNum
  }
});

beforeEach(() => {
  jest.clearAllMocks();
  store.clearActions();
});

describe('createGroup', () => {
  // Test the newGroup action that it makes a group properly
  it('should generate new group action object', () => {
    expect(newGroup('Group 1', '1', 'CS1010E')).toEqual({
      type: 'NEW_GROUP',
      name: 'Group 1',
      groupId: '1',
      module: 'CS1010E'
    });
  });

  // Test startNewGroups
  it('should create a new group in firestore with user as admin', () => {
    const name = 'Group 2';
    const module = 'Bruh';
    return store.dispatch(startNewGroup(name, module)).then(() => {
      const actions = store.getActions();
      expect(v4).toHaveBeenCalledTimes(1);

      expect(collection).toHaveBeenCalledTimes(2);
      expect(collection).toHaveBeenNthCalledWith(1, 'users');
      expect(collection).toHaveBeenNthCalledWith(2, 'groups');

      expect(collection('users').doc).toHaveBeenCalledTimes(1);
      expect(collection('users').doc).toHaveBeenLastCalledWith(uid);

      expect(collection('groups').doc).toHaveBeenCalledTimes(1);
      expect(collection('groups').doc).toHaveBeenLastCalledWith(v4());

      expect(collection('users').doc(uid).update).toHaveBeenCalledTimes(1);
      expect(collection('users').doc(uid).update).toHaveBeenLastCalledWith({
        groups: arrayUnionReturnValue
      });

      expect(FieldValue.arrayUnion).toHaveBeenCalledTimes(1);
      expect(FieldValue.arrayUnion).toHaveBeenLastCalledWith(v4());

      expect(collection('groups').doc(v4()).set).toHaveBeenCalledTimes(1);
      expect(collection('groups').doc(v4()).set).toHaveBeenLastCalledWith({
        name,
        module
      });

      expect(collection('groups').doc(v4()).collection).toHaveBeenCalledTimes(
        1
      );
      expect(
        collection('groups').doc(v4()).collection
      ).toHaveBeenLastCalledWith('users');

      expect(
        collection('groups').doc(v4()).collection('users').doc
      ).toHaveBeenCalledTimes(1);
      expect(
        collection('groups').doc(v4()).collection('users').doc
      ).toHaveBeenLastCalledWith(uid);

      expect(
        collection('groups').doc(v4()).collection('users').doc(uid).set
      ).toHaveBeenCalledTimes(1);
      expect(
        collection('groups').doc(v4()).collection('users').doc(uid).set
      ).toHaveBeenLastCalledWith({
        uid,
        displayName,
        studentNum,
        admin: true
      }); // Expect the creator user to be an admin.

      expect(actions).toHaveLength(2);
      expect(actions[0]).toEqual(newGroup(name, v4(), module));
      expect(actions[1]).toEqual(addGroup(v4()));
    });
  });
});

// Adding users
describe('getUser', () => {
  it('should get the user object from firestore emailToUid', () => {
    // User exists
    const email = 'email';
    return getUser(email).then(() => {
      expect(collection).toHaveBeenCalledTimes(2);
      expect(collection).toHaveBeenNthCalledWith(1, 'emailToUid');
      expect(collection).toHaveBeenNthCalledWith(2, 'users');

      expect(collection('emailToUid').doc).toHaveBeenCalledTimes(1);
      expect(collection('emailToUid').doc).toHaveBeenLastCalledWith(email);

      expect(collection('emailToUid').doc(email).get).toHaveBeenCalledTimes(1);
      expect(
        collection('emailToUid').doc(email).get
      ).toHaveBeenLastCalledWith();

      // uidDoc exists
      expect(collection('users').doc).toHaveBeenCalledTimes(1);
      expect(collection('users').doc).toHaveBeenLastCalledWith(uid);

      expect(collection('users').doc(uid).get).toHaveBeenCalledTimes(1);
      expect(collection('users').doc(uid).get).toHaveBeenLastCalledWith();
    });
  });
  it('should not try to retrieve the data for an email not in firestore', () => {
    const email = 'no email here';
    return getUser(email).then(() => {
      expect(collection).toHaveBeenCalledTimes(1);
      expect(collection).toHaveBeenNthCalledWith(1, 'emailToUid');

      expect(collection('emailToUid').doc).toHaveBeenCalledTimes(1);
      expect(collection('emailToUid').doc).toHaveBeenLastCalledWith(email);

      expect(collection('emailToUid').doc(email).get).toHaveBeenCalledTimes(1);
      expect(
        collection('emailToUid').doc(email).get
      ).toHaveBeenLastCalledWith();

      // uidDoc does not exist, expect the other functions not to be called
      expect(collection('users').doc).toHaveBeenCalledTimes(0);
      expect(collection('users').doc(uid).get).toHaveBeenCalledTimes(0);
    });
  });
});

describe('addingUser', () => {
  const user = {
    uid,
    displayName,
    studentNum
  };
  const gid = '72b6b3bb-cb74-4d08-ae67-dfc1b51baaf9';
  it('should set a new document in the group and add the group to the users array', () => {
    return addNewUser(user, gid).then(() => {
      expect(collection).toHaveBeenCalledTimes(2);
      expect(collection).toHaveBeenNthCalledWith(1, 'groups');
      expect(collection).toHaveBeenNthCalledWith(2, 'users');

      // groupPromise
      expect(collection('groups').doc).toHaveBeenCalledTimes(1);
      expect(collection('groups').doc).toHaveBeenLastCalledWith(gid);

      expect(collection('groups').doc(gid).collection).toHaveBeenCalledTimes(1);
      expect(collection('groups').doc(gid).collection).toHaveBeenLastCalledWith(
        'users'
      );

      expect(
        collection('groups').doc(gid).collection('users').doc
      ).toHaveBeenCalledTimes(1);
      expect(
        collection('groups').doc(gid).collection('users').doc
      ).toHaveBeenLastCalledWith(uid);

      expect(
        collection('groups').doc(gid).collection('users').doc(uid).set
      ).toHaveBeenCalledTimes(1);
      expect(
        collection('groups').doc(gid).collection('users').doc(uid).set
      ).toHaveBeenLastCalledWith({
        displayName: user.displayName,
        studentNum: user.studentNum,
        uid,
        admin: false
      });

      // userPromise
      expect(collection('users').doc).toHaveBeenCalledTimes(1);
      expect(collection('users').doc).toHaveBeenLastCalledWith(uid);

      expect(collection('users').doc(uid).update).toHaveBeenCalledTimes(1);
      expect(collection('users').doc(uid).update).toHaveBeenLastCalledWith({
        groups: arrayUnionReturnValue
      });
    });
  });
});

// Leaving groups
describe('leaveGroup', () => {
  const gid = '72b6b3bb-cb74-4d08-ae67-dfc1b51baaf9';
  it('should generate action object', () => {
    expect(leaveGroup(gid)).toEqual({
      type: 'LEAVE_GROUP',
      gid
    });
  });
  it('should remove the user from the group and the group from the users array', () => {
    return store.dispatch(startLeaveGroup(gid, 3)).then(() => {
      expect(collection).toHaveBeenCalledTimes(3);

      // groupRef
      expect(collection).toHaveBeenNthCalledWith(1, 'groups');
      expect(collection('groups').doc).toHaveBeenCalledTimes(2);
      // Each usage of groupRef counts as a call.
      expect(collection('groups').doc).toHaveBeenNthCalledWith(1, gid);
      expect(collection('groups').doc).toHaveBeenNthCalledWith(2, gid);

      // groupPromise
      expect(collection('groups').doc(gid).collection).toHaveBeenCalledTimes(3);
      expect(collection('groups').doc(gid).collection).toHaveBeenNthCalledWith(
        1,
        'users'
      );
      expect(
        collection('groups').doc(gid).collection('users').doc
      ).toHaveBeenCalledTimes(1);
      expect(
        collection('groups').doc(gid).collection('users').doc
      ).toHaveBeenLastCalledWith(uid);
      expect(
        collection('groups').doc(gid).collection('users').doc(uid).delete
      ).toHaveBeenCalledTimes(1);
      expect(
        collection('groups').doc(gid).collection('users').doc(uid).delete
      ).toHaveBeenLastCalledWith();

      // userPromise
      expect(collection).toHaveBeenNthCalledWith(2, 'users');
      expect(collection('users').doc).toHaveBeenCalledTimes(1);
      expect(collection('users').doc).toHaveBeenLastCalledWith(uid);
      expect(collection('users').doc(uid).update).toHaveBeenCalledTimes(1);
      expect(collection('users').doc(uid).update).toHaveBeenLastCalledWith({
        groups: arrayRemoveReturnValue
      });

      // tasksPromise
      expect(collection('groups').doc(gid).collection).toHaveBeenNthCalledWith(
        3,
        'tasks'
      );
      expect(
        collection('groups').doc(gid).collection('tasks').get
      ).toHaveBeenCalledTimes(1);
      expect(
        collection('groups').doc(gid).collection('tasks').get
      ).toHaveBeenLastCalledWith();
      expect(FieldValue.delete).toHaveBeenCalledTimes(2);
      expect(FieldValue.delete).toHaveBeenLastCalledWith();
    });
  });

  it('should delete the group if the user is the only one left', () => {
    return store.dispatch(startLeaveGroup(gid, 1)).then(() => {
      // Copy from above, but needs to recount
      expect(collection).toHaveBeenCalledTimes(3);

      // groupRef
      expect(collection).toHaveBeenNthCalledWith(1, 'groups');
      expect(collection('groups').doc).toHaveBeenCalledTimes(2);
      // Each usage of groupRef counts as a call.
      expect(collection('groups').doc).toHaveBeenNthCalledWith(1, gid);
      expect(collection('groups').doc).toHaveBeenNthCalledWith(2, gid);

      // groupPromise
      expect(collection('groups').doc(gid).collection).toHaveBeenCalledTimes(5);
      expect(collection('groups').doc(gid).collection).toHaveBeenNthCalledWith(
        1,
        'users'
      );
      expect(
        collection('groups').doc(gid).collection('users').doc
      ).toHaveBeenCalledTimes(1);
      expect(
        collection('groups').doc(gid).collection('users').doc
      ).toHaveBeenLastCalledWith(uid);
      expect(
        collection('groups').doc(gid).collection('users').doc(uid).delete
      ).toHaveBeenCalledTimes(1);
      expect(
        collection('groups').doc(gid).collection('users').doc(uid).delete
      ).toHaveBeenLastCalledWith();

      // userPromise
      expect(collection).toHaveBeenNthCalledWith(2, 'users');
      expect(collection('users').doc).toHaveBeenCalledTimes(1);
      expect(collection('users').doc).toHaveBeenLastCalledWith(uid);
      expect(collection('users').doc(uid).update).toHaveBeenCalledTimes(1);
      expect(collection('users').doc(uid).update).toHaveBeenLastCalledWith({
        groups: arrayRemoveReturnValue
      });

      // tasksPromise
      expect(collection('groups').doc(gid).collection).toHaveBeenNthCalledWith(
        3,
        'tasks'
      );
      expect(
        collection('groups').doc(gid).collection('tasks').get
      ).toHaveBeenCalledTimes(2);
      expect(
        collection('groups').doc(gid).collection('tasks').get
      ).toHaveBeenLastCalledWith();
      expect(FieldValue.delete).toHaveBeenCalledTimes(2);
      expect(FieldValue.delete).toHaveBeenLastCalledWith();

      // For removing the group
      expect(collection('groups').doc(gid).collection).toHaveBeenNthCalledWith(4, 'users')
      expect(collection('groups').doc(gid).collection).toHaveBeenNthCalledWith(5, 'tasks')
    });
  });
});

// // Kicking users
// describe('kickUsersAsAdmin', () => {
//   // recheckAdmin should be called with the current user
//   it('should check if the current user is an admin', () => {
//     expect(recheckAdmin).toHaveBeenCalledWith();
//     // TODO: Replace with the actual arguments
//     expect(Promise.resolve(recheckAdmin('uid', 'gid'))).toEqual(true);
//   });
//   // If admin
//   it('should remove user from group');

//   it('should remove user from tasks set in the group');
// });

// describe('kickUsersAsNonAdmin', () => {
//   it('should check if the current user is an admin', () => {
//     expect(Promise.resolve(recheckAdmin('uid', 'gid'))).toEqual(false);
//   });

//   // If not admin - expect the actions to not be called at all?
//   it('should not remove user from group if not admin');

//   it('should not remove user from tasks if not admin');
// });

// // Demoting/Promoting users
// describe('promoteAsAdmin');

// describe('demoteAsAdmin');

// describe('promoteAsNonAdmin');

// describe('demoteAsNonAdmin');

// Fetching all groups
describe('setGroups', () => {
  it('should generate action object', () => {
    const groups = [];
    expect(setGroups([])).toEqual({
      type: 'SET_GROUPS',
      groups
    });
  });
  it('should fetch all groups from firestore', () => {
    const groups = [
      '72b6b3bb-cb74-4d08-ae67-dfc1b51baaf9',
      'ce5c9b1b-e4d2-4dd2-bae4-7c559e8235ea',
      '3e28d54d-ebc1-4469-be21-e59ce210f245'
    ];

    return store.dispatch(startSetGroups()).then(() => {
      const actions = store.getActions();
      expect(collection).toHaveBeenCalledTimes(4);
      expect(collection).toHaveBeenNthCalledWith(1, 'users');

      // Retrieving the user's array of groups
      expect(collection('users').doc).toHaveBeenCalledTimes(1);
      expect(collection('users').doc).toHaveBeenLastCalledWith(uid);

      expect(collection('users').doc(uid).get).toHaveBeenCalledTimes(1);
      expect(collection('users').doc(uid).get).toHaveBeenLastCalledWith();

      // Test case user has 3 groups, so collection fetches the groups 3 times
      expect(collection('groups').doc).toHaveBeenCalledTimes(3);

      expect(collection).toHaveBeenNthCalledWith(2, 'groups');
      expect(collection('groups').doc).toHaveBeenNthCalledWith(1, groups[0]);
      expect(collection('groups').doc(groups[0]).get).toHaveBeenCalledTimes(1);

      expect(collection).toHaveBeenNthCalledWith(3, 'groups');
      expect(collection('groups').doc).toHaveBeenNthCalledWith(2, groups[1]);
      expect(collection('groups').doc(groups[1]).get).toHaveBeenCalledTimes(1);

      expect(collection).toHaveBeenNthCalledWith(4, 'groups');
      expect(collection('groups').doc).toHaveBeenNthCalledWith(3, groups[2]);
      expect(collection('groups').doc(groups[2]).get).toHaveBeenCalledTimes(1);

      // Store actions dispatched
      expect(actions).toHaveLength(1);
      expect(actions[0].type).toEqual('SET_GROUPS');
    });
  });
});
