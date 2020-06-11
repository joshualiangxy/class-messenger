export const sortByDeadline = () => ({ type: 'SORT_BY_DEADLINE' });

export const sortByDeadlineReversed = () => ({
  type: 'SORT_BY_DEADLINE_REVERSED'
});

export const sortByName = () => ({ type: 'SORT_BY_NAME' });

export const sortByNameReversed = () => ({ type: 'SORT_BY_NAME_REVERSED' });

export const setTextFilter = (text = '') => ({ type: 'SET_TEXT_FILTER', text });

export const toggleGrouped = () => ({ type: 'TOGGLE_GROUPED' });
