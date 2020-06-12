import React from 'react';
import { shallow } from 'enzyme';
import { LoginPage } from '../../components/LoginPage';

const startLogin = jest.fn(() => Promise.resolve());
const wrapper = shallow(<LoginPage startLogin={startLogin} />);

describe('render', () => {
  it('should render LoginPage', () => expect(wrapper).toMatchSnapshot());
});

describe('login button', () => {
  it('should call startLogin on button click', () =>
    wrapper
      .find('button')
      .prop('onClick')()
      .then(() => expect(startLogin).toHaveBeenCalledTimes(1)));
});
