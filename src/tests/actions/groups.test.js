import createMockStore from '../../setupTests';
import {
  newGroup,
  startNewGroup,
  addNewUser,
  recheckAdmin,
  setGroups,
  startSetGroups
} from '../../actions/groups';
import user from '../fixtures/user';
import user2 from '../fixtures/user2';

jest.mock('firebase');
const store = createMockStore({});

beforeEach(() => {
  jest.clearAllMocks();
  store.clearActions();
});

describe('createGroup', () => {
  // Test the newGroup action that it makes a group properly
  it('should generate new group action object', () => {
    expect(
      newGroup('Group 1', '1', 'CS1010E').toEqual({
        type: 'NEW_GROUP',
        name: 'Group 1',
        groupId: '1',
        module: 'CS1010E'
      })
    );
  });

  // Test startNewGroups
  it('should have the creator of the group as an admin', () => {
    startNewGroup('Group 2', 'Bruh');
  });

  it('should add the group to the creator group list')
});

// Adding users
describe('addingUsers', () => {
  it('should check that the current user is an admin');

  it('should check that the specified user is valid')

  it('should add user to firestore', () => addNewUser(user, '12345'));

  it('should add group to user');
});

describe('addingUsersAsAdmin', () => {
  it('should check that the current user is an admin');

  it('should not add user to firestore', () => addNewUser(user, '12345'));

  it('should not add group to user');
});


// Kicking users
describe('kickUsersAsAdmin', () => {
  // recheckAdmin should be called with the current user
  it('should check if the current user is an admin', () => {
    expect(recheckAdmin).toHaveBeenCalledWith();
    // TODO: Replace with the actual arguments
    expect(Promise.resolve(recheckAdmin('uid', 'gid'))).toEqual(true)     
  });
  // If admin
  it('should remove user from group');

  it('should remove user from tasks set in the group');
});

describe('kickUseresAsNonAdmin', () => {
  it('should check if the current user is an admin', () => {
    expect(Promise.resolve(recheckAdmin('uid', 'gid'))).toEqual(false)    
  })
  
  // If not admin - expect the actions to not be called at all?
  it('should not remove user from group if not admin');

  it('should not remove user from tasks if not admin');

})

// Demoting/Promoting users
describe('promoteAsAdmin')

describe('demoteAsAdmin')

describe('promoteAsNonAdmin')

describe('demoteAsNonAdmin')

// Fetching all groups
describe('fetchAllGroups', () => {
  // replace 'groups' with the actual array of groups to use
  it('should generate action object', () => 
  expect(setGroups('groups').toEqual({
    type: 'SET_GROUPS',
    groups: 'groups'
  }))
 )
})