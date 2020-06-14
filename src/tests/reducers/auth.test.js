import authReducer from '../../reducers/auth';

describe('reducer', () => {
  const user = { uid: 'abc123', email: 'abc@123' };

  it('should initialise default auth state', () => {
    const state = authReducer(undefined, { type: '@@INIT' });

    expect(state).toEqual({});
  });

  it('should return login state', () => {
    const state = authReducer(undefined, { type: 'LOGIN', user });

    expect(state).toEqual({ user });
  });

  it('should return logout state', () => {
    const state = authReducer({ user }, { type: 'LOGOUT' });

    expect(state).toEqual({});
  });
});
