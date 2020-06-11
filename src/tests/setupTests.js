import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import '@testing-library/jest-dom/extend-expect';

const createMockStore = configureMockStore([thunk]);

export default createMockStore;
