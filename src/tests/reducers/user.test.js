import userReducer from '../../reducers/user';
import user from '../fixtures/user';

describe('reducer', () => {
  const displayName = user.displayName;
  const studentNum = user.studentNum;

  it('should initialise default state', () => {
    const state = userReducer(undefined, { type: '@@INIT' });

    expect(state).toEqual({});
  });

  it('should get user data', () => {
    const state = userReducer(undefined, {
      type: 'GET_USER_DATA',
      displayName,
      studentNum
    });

    expect(state).toEqual({ displayName, studentNum, newUser: false });
  });

  it('should set user data', () => {
    const state = userReducer(undefined, {
      type: 'GET_USER_DATA',
      displayName,
      studentNum
    });

    expect(state).toEqual({ displayName, studentNum, newUser: false });
  });

  it('should set user as new user', () => {
    const state = userReducer(undefined, { type: 'NEW_USER' });

    expect(state).toEqual({ newUser: true });
  });

  it('should remove user data', () => {
    const initialState = { displayName, studentNum, newUser: false };
    const state = userReducer(initialState, { type: 'REMOVE_USER_DATA' });

    expect(state).toEqual({});
  });
});
