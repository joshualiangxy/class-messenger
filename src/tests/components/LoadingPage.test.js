import React from 'react';
import { shallow } from 'enzyme';
import LoadingPage from '../../components/LoadingPage';

const wrapper = shallow(<LoadingPage />);

describe('render', () => {
  it('should render LoadingPage', () => expect(wrapper).toMatchSnapshot());
});
