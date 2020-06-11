const defaultState = { text: '', sortBy: 'deadline', grouped: true };

const filtersReducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'SORT_BY_NAME':
      return { ...state, sortBy: 'name' };
    case 'SORT_BY_NAME_REVERSED':
      return { ...state, sortBy: 'nameReversed' };
    case 'SORT_BY_DEADLINE':
      return { ...state, sortBy: 'deadline' };
    case 'SORT_BY_DEADLINE_REVERSED':
      return { ...state, sortBy: 'deadlineReversed' };
    case 'SET_TEXT_FILTER':
      return { ...state, text: action.text };
    case 'TOGGLE_GROUPED':
      return { ...state, grouped: !state.grouped };
    default:
      return state;
  }
};

export default filtersReducer;
