import React from 'react';
import { shallow } from 'enzyme';
import NotFoundPage from '../../components/NotFoundPage';

const wrapper = shallow(<NotFoundPage />);

describe('render', () => {
  it('should render NotFoundPage', () => expect(wrapper).toMatchSnapshot());
});

describe('home link', () => {
  it('should link to home page', () =>
    expect(wrapper.find('Link').prop('to')).toBe('/'));
});
