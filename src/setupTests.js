import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import enableHooks from 'jest-react-hooks-shallow';
import { config } from 'react-transition-group';
import '@testing-library/jest-dom/extend-expect';

configure({ adapter: new Adapter() });
enableHooks(jest);
config.disabled = true;

const createMockStore = configureMockStore([thunk]);

export default createMockStore;
