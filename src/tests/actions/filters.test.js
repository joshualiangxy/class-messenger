//import {
//sortByDeadline,
//sortByDeadlineReversed,
//sortByName,
//sortByNameReversed,
//setTextFilter,
//toggleGrouped
//} from '../../actions/filters';

//describe('sort by deadline', () => {
//it('should generate action object', () =>
//expect(sortByDeadline()).toEqual({ type: 'SORT_BY_DEADLINE' }));

//it('should generate reversed action object', () =>
//expect(sortByDeadlineReversed()).toEqual({
//type: 'SORT_BY_DEADLINE_REVERSED'
//}));
//});

//describe('sort by name', () => {
//it('should generate sort by name action object', () =>
//expect(sortByName()).toEqual({ type: 'SORT_BY_NAME' }));

//it('should generate reversed action object', () =>
//expect(sortByNameReversed()).toEqual({ type: 'SORT_BY_NAME_REVERSED' }));
//});

//describe('set text filter', () => {
//it('should generate set text filter action object with appropriate text', () => {
//const text = 'abc123';
//expect(setTextFilter(text)).toEqual({ type: 'SET_TEXT_FILTER', text });
//});

//it('should generate set text filter action object with empty string', () =>
//expect(setTextFilter()).toEqual({ type: 'SET_TEXT_FILTER', text: '' }));
//});

//describe('toggle grouped', () => {
//it('should generate action object', () =>
//expect(toggleGrouped()).toEqual({ type: 'TOGGLE_GROUPED' }));
//});
