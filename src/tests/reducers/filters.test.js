import filtersReducer from '../../reducers/filters';

describe('reducer', () => {
  const defaultState = { text: '', sortBy: 'deadline', grouped: true };

  it('should initialise default filters state', () => {
    const state = filtersReducer(undefined, { type: '@@INIT' });

    expect(state).toEqual(defaultState);
  });

  it('should set sortBy to name', () => {
    const state = filtersReducer(undefined, { type: 'SORT_BY_NAME' });

    expect(state).toEqual({ ...defaultState, sortBy: 'name' });
  });

  it('should set sortBy to name reversed', () => {
    const state = filtersReducer(undefined, { type: 'SORT_BY_NAME_REVERSED' });

    expect(state).toEqual({ ...defaultState, sortBy: 'nameReversed' });
  });

  it('should set sortBy to deadline', () => {
    const initialState = { ...defaultState, sortBy: 'name' };
    const state = filtersReducer(initialState, { type: 'SORT_BY_DEADLINE' });

    expect(state).toEqual({ ...initialState, sortBy: 'deadline' });
  });

  it('should set sortBy to deadline reversed', () => {
    const state = filtersReducer(undefined, {
      type: 'SORT_BY_DEADLINE_REVERSED'
    });

    expect(state).toEqual({ ...defaultState, sortBy: 'deadlineReversed' });
  });

  it('should set text filter', () => {
    const text = 'abc123';
    const state = filtersReducer(undefined, { type: 'SET_TEXT_FILTER', text });

    expect(state).toEqual({ ...defaultState, text });
  });

  it('should toggle grouped boolean', () => {
    const state = filtersReducer(undefined, { type: 'TOGGLE_GROUPED' });

    expect(state).toEqual({ ...defaultState, grouped: !defaultState.grouped });
  });
});
