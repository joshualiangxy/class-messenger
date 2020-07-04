import userReducer from '../../reducers/user';
import user from '../fixtures/user';

describe('reducer', () => {
  const displayName = user.displayName;
  const studentNum = user.studentNum;
  const groups = user.groups;

  it('should initialise default state', () => {
    const state = userReducer(undefined, { type: '@@INIT' });

    expect(state).toEqual({
      displayName: '',
      studentNum: '',
      groups: [],
      newUser: false
    });
  });

  it('should get user data', () => {
    const state = userReducer(undefined, {
      type: 'GET_USER_DATA',
      displayName,
      studentNum,
      groups
    });

    expect(state).toEqual({ displayName, studentNum, newUser: false, groups });
  });

  it('should set user data', () => {
    const state = userReducer(undefined, {
      type: 'SET_USER_DATA',
      displayName,
      studentNum
    });

    expect(state).toEqual({
      displayName,
      studentNum,
      newUser: false,
      groups: []
    });
  });

  it('should set user as new user', () => {
    const state = userReducer(undefined, { type: 'NEW_USER' });

    expect(state).toEqual({
      newUser: true,
      displayName: '',
      studentNum: '',
      groups: []
    });
  });

  it('should remove user data', () => {
    const initialState = { displayName, studentNum, newUser: false };
    const state = userReducer(initialState, { type: 'REMOVE_USER_DATA' });

    expect(state).toEqual({});
  });

  it('should add group to user', () => {
    const initialState = {
      displayName,
      studentNum,
      newUser: false,
      groups: []
    };
    const state = userReducer(initialState, {
      type: 'ADD_GROUP',
      gid: 'testgid'
    });

    expect(state).toEqual({ ...initialState, groups: ['testgid'] });
  });
});
