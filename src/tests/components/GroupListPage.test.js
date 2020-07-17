import React from 'react';
import { shallow } from 'enzyme';
import { GroupListPage } from '../../components/GroupListPage';
import { noGroups, groupSetOne, groupSetTwo } from '../fixtures/groups';

const wrapper = shallow(<GroupListPage groups={noGroups} />);

describe('render', () => {
  it('should render GroupListPage without groups', () =>
    expect(wrapper).toMatchSnapshot());

  it('should render GroupListPage with one group', () => {
    wrapper.setProps({ groups: groupSetOne });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render GroupListPage with two groups', () => {
    wrapper.setProps({ groups: groupSetTwo });
    expect(wrapper).toMatchSnapshot();
  });
});

describe('addGroupButton', () => {
  it('should have AddGroupModal closed at first', () => {
    expect(wrapper.find("Connect(AddGroupModal)").prop("isOpen")).toBe(false);
  })

  it('should open AddGroupModal on click', () => {
    wrapper.find("button").at(0).prop("onClick")()
    expect(wrapper.find("Connect(AddGroupModal)").prop("isOpen")).toBe(true);
  })

})

describe('addGroupModal', () => {
  it('should close AddGroupModal when calling onRequestClose', () => {
    
    expect(wrapper.find("Connect(AddGroupModal)").prop("isOpen")).toBe(true);
    wrapper.find("Connect(AddGroupModal)").prop("onRequestClose")()
    expect(wrapper.find("Connect(AddGroupModal)").prop("isOpen")).toBe(false);

  })
})