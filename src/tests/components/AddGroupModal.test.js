import React from 'react';
import { shallow } from 'enzyme';
import { AddGroupModal } from '../../components/AddGroupModal';
import { groupSetOne } from '../fixtures/groups';

const onRequestClose = jest.fn();
const preventDefault = jest.fn();
const startNewGroup = jest.fn((submittedName, submittedMod) =>
  Promise.resolve()
);

const testOne = {
  groupName: 'testTwo',
  module: 'testMod'
};

const testTwo = {
  groupName: 'testTwo',
  module: ''
};

const testThree = {
  groupName: ' ',
  module: 'testThree'
};

const testFour = {
  groupName: '',
  module: ''
};
let wrapper;

beforeEach(() => {
  jest.clearAllMocks();
  wrapper = shallow(
    <AddGroupModal
      isOpen={true}
      onRequestClose={onRequestClose}
      startNewGroup={startNewGroup}
    />
  );
});

describe('render', () => {
  it('should render AddGroupModal', () => expect(wrapper).toMatchSnapshot());

  it('should have a group name and module input', () => {
    expect(wrapper.find('input[type="text"]')).toHaveLength(2);
  });

  it('should render with placeholder text', () => {
    expect(wrapper.find('input').at(0).prop('placeholder')).toEqual(
      'Group name (required)'
    );
    expect(wrapper.find('input').at(1).prop('placeholder')).toEqual(
      'Module code/Class name (Optional)'
    );
  });
});

describe('input', () => {
  it('should have input change for groupName', () => {
    expect(wrapper.find('input').at(0).prop('value')).toEqual('');
    wrapper.find('input').at(0).prop('onChange')({
      target: { value: testOne.groupName }
    });
    expect(wrapper.find('input').at(0).prop('value')).toEqual(
      testOne.groupName
    );
  });

  it('should have input change for module', () => {
    expect(wrapper.find('input').at(1).prop('value')).toEqual('');
    wrapper.find('input').at(1).prop('onChange')({
      target: { value: { toUpperCase: () => testOne.module } }
    });
    expect(wrapper.find('input').at(1).prop('value')).toEqual(testOne.module);
  });
});

describe('submit', () => {
  it('should start groups with name and module', () => {
    // Set input
    wrapper.find('input').at(0).prop('onChange')({
      target: { value: testOne.groupName }
    });
    wrapper.find('input').at(1).prop('onChange')({
      target: { value: { toUpperCase: () => testOne.module } }
    });
    wrapper.find('form').at(0).prop('onSubmit')({ preventDefault });
    expect(preventDefault).toHaveBeenCalledTimes(1);
    expect(startNewGroup).toHaveBeenCalledTimes(1);
    expect(startNewGroup).toHaveBeenLastCalledWith(
      testOne.groupName,
      testOne.module
    );
  });

  it('should start groups with name and no module', () => {
    // Set input
    wrapper.find('input').at(0).prop('onChange')({
      target: { value: testTwo.groupName }
    });
    wrapper.find('input').at(1).prop('onChange')({
      target: { value: { toUpperCase: () => testTwo.module } }
    });
    wrapper.find('form').at(0).prop('onSubmit')({ preventDefault });
    expect(preventDefault).toHaveBeenCalledTimes(1);
    expect(startNewGroup).toHaveBeenCalledTimes(1);
    expect(startNewGroup).toHaveBeenLastCalledWith(
      testTwo.groupName,
      testTwo.module
    );
  });

  it('should not start groups with whitespace name with valid module', () => {
    // Set input
    wrapper.find('input').at(0).prop('onChange')({
      target: { value: testThree.groupName }
    });
    wrapper.find('input').at(1).prop('onChange')({
      target: { value: { toUpperCase: () => testThree.module } }
    });
    wrapper.find('form').at(0).prop('onSubmit')({ preventDefault });
    expect(preventDefault).toHaveBeenCalledTimes(1);
    expect(startNewGroup).toHaveBeenCalledTimes(0);
    expect(wrapper.find('.form__error').text()).toEqual(
      'Please enter a group name'
    );
  });

  it('should not start groups with no name and no module', () => {
    // Set input
    wrapper.find('input').at(0).prop('onChange')({
      target: { value: testFour.groupName }
    });
    wrapper.find('input').at(1).prop('onChange')({
      target: { value: { toUpperCase: () => testFour.module } }
    });
    wrapper.find('form').at(0).prop('onSubmit')({ preventDefault });
    expect(preventDefault).toHaveBeenCalledTimes(1);
    expect(startNewGroup).toHaveBeenCalledTimes(0);
    expect(wrapper.find('.form__error').text()).toEqual(
      'Please enter a group name'
    );
  });

  it('should reset error message on success', () => {
    // Set input
    wrapper.find('input').at(0).prop('onChange')({
      target: { value: testFour.groupName }
    });
    wrapper.find('input').at(1).prop('onChange')({
      target: { value: { toUpperCase: () => testFour.module } }
    });
    wrapper.find('form').at(0).prop('onSubmit')({ preventDefault });
    // Set input to working group
    wrapper.find('input').at(0).prop('onChange')({
      target: { value: testTwo.groupName }
    });
    wrapper.find('input').at(1).prop('onChange')({
      target: { value: { toUpperCase: () => testTwo.module } }
    });
    wrapper.find('form').at(0).prop('onSubmit')({ preventDefault });
    expect(wrapper.find('.form__error')).toHaveLength(0);
  });
});

describe('cancel', () => {
  it('should reset all fields on cancel', () => {
    // Set input
    wrapper.find('input').at(0).prop('onChange')({
      target: { value: testOne.groupName }
    });
    wrapper.find('input').at(1).prop('onChange')({
      target: { value: { toUpperCase: () => testOne.module } }
    });
    wrapper.find('Modal').at(0).prop('onRequestClose')();

    expect(onRequestClose).toHaveBeenCalledTimes(1);
    expect(wrapper.find('input').at(0).prop('value')).toEqual('');
    expect(wrapper.find('input').at(1).prop('value')).toEqual('');
    expect(wrapper.find('.form__error')).toHaveLength(0)
  });
});
