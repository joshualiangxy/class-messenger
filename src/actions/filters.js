export const sortByDeadline = () => ({ type: 'SORT_BY_DEADLINE' });

export const sortByName = () => ({ type: 'SORT_BY_NAME' });

export const setTextFilter = (text = '') => ({ type: 'SET_TEXT_FILTER', text });

export const toggleGrouped = () => ({ type: 'TOGGLE_GROUPED' });
