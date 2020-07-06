import React from 'react';
import { shallow } from 'enzyme';
import SelectUserModal from '../../components/SelectUserModal';
import users from '../fixtures/groupUsers';

const wrapper = shallow(<SelectUserModal users={users} />);

describe('render', () => {
  it('should render SelectUserModal', () => expect(wrapper).toMatchSnapshot());
});
