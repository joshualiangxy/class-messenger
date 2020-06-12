import React from 'react';
import { shallow } from 'enzyme';
import { Header } from '../../components/Header';

let wrapper;
const startLogout = jest.fn(() => Promise.resolve());

beforeEach(() => {
  wrapper = shallow(<Header startLogout={startLogout} />);
});

describe('render', () => {
  it('should render Header', () => expect(wrapper).toMatchSnapshot());
});

describe('settings modal', () => {
  it('should be open if user is new', () => {
    wrapper.setProps({ isNewUser: true });

    expect(wrapper.find('Connect(SettingsModal)').prop('isOpen')).toBe(true);
  });

  it('should not close if user is new and is not submitting', () => {
    wrapper.setProps({ isNewUser: true });

    wrapper.find('Connect(SettingsModal)').prop('onRequestClose')(false);

    expect(wrapper.find('Connect(SettingsModal)').prop('isOpen')).toBe(true);
  });

  it('should be closed if user is not new', () =>
    expect(wrapper.find('Connect(SettingsModal)').prop('isOpen')).toBe(false));
});

describe('settings button', () => {
  it('should open settings modal on button click', () => {
    expect(wrapper.find('Connect(SettingsModal)').prop('isOpen')).toBe(false);

    wrapper.find('button').at(0).prop('onClick')();

    expect(wrapper.find('Connect(SettingsModal)').prop('isOpen')).toBe(true);
  });
});

describe('logout button', () => {
  it('should call startLogout on button click', () =>
    wrapper
      .find('button')
      .at(1)
      .prop('onClick')()
      .then(() => expect(startLogout).toHaveBeenCalledTimes(1)));
});

describe('home link', () => {
  it('should link to the dashboard page', () =>
    expect(wrapper.find('Link').prop('to')).toBe('/dashboard'));
});

describe('groups link', () => {
  it('should link to the groups page', () => {
    const groupsLink = wrapper.find('NavLink');

    expect(groupsLink.prop('to')).toBe('/groups');
    expect(groupsLink.prop('exact')).toBe(true);
  });
});
