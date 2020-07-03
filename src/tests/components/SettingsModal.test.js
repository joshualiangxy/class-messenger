import React from 'react';
import { shallow } from 'enzyme';
import user from '../fixtures/user';
import { SettingsModal } from '../../components/SettingsModal';

const startSetUserData = jest.fn(() => Promise.resolve());
const onRequestClose = jest.fn();
const displayName = user.displayName;
const studentNum = user.studentNum;
let wrapper;

beforeEach(() => {
  wrapper = shallow(
    <SettingsModal
      startSetUserData={startSetUserData}
      onRequestClose={onRequestClose}
    />
  );
  onRequestClose.mockClear();
});

describe('render', () => {
  it('should render SettingsModal', () => expect(wrapper).toMatchSnapshot());

  it('should render SettingsModal with displayName and studentNum', () => {
    wrapper = shallow(
      <SettingsModal
        startSetUserData={startSetUserData}
        initialDisplayName={displayName}
        initialStudentNum={studentNum}
        onRequestClose={onRequestClose}
      />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should render different text and disabled cancel button for new user', () => {
    wrapper.setProps({ isNewUser: true });

    expect(wrapper).toMatchSnapshot();
  });
});

describe('display name input', () => {
  it('should set display name on input change', () => {
    const value = displayName;

    expect(wrapper.find('input').at(0).prop('value')).toBe('');

    wrapper.find('input').at(0).prop('onChange')({ target: { value } });

    expect(wrapper.find('input').at(0).prop('value')).toBe(value);
  });
});

describe('student number input', () => {
  it('should set student number on valid input change', () => {
    const value = studentNum;

    expect(wrapper.find('input').at(1).prop('value')).toBe('');

    wrapper.find('input').at(1).prop('onChange')({ target: { value } });

    expect(wrapper.find('input').at(1).prop('value')).toBe(value);
  });

  it('should set student number to uppercase if lowercase input is valid', () => {
    const value = 'a002';

    expect(wrapper.find('input').at(1).prop('value')).toBe('');

    wrapper.find('input').at(1).prop('onChange')({ target: { value } });

    expect(wrapper.find('input').at(1).prop('value')).toBe(value.toUpperCase());
  });

  it('should not set student number if invalid input', () => {
    const value = 'abc123';

    expect(wrapper.find('input').at(1).prop('value')).toBe('');

    wrapper.find('input').at(1).prop('onChange')({ target: { value } });

    expect(wrapper.find('input').at(1).prop('value')).toBe('');
  });
});

describe('cancel button', () => {
  const newDisplayName = 'robert';
  const newStudentNum = 'A0000000A';

  it('should set display name and student number back to initial state and close modal', () => {
    wrapper.setProps({
      initialDisplayName: displayName,
      initialStudentNum: studentNum
    });
    wrapper.find('input').at(0).prop('onChange')({
      target: { value: newDisplayName }
    });
    wrapper.find('input').at(1).prop('onChange')({
      target: { value: newStudentNum }
    });

    expect(wrapper.find('input').at(0).prop('value')).toBe(newDisplayName);
    expect(wrapper.find('input').at(1).prop('value')).toBe(newStudentNum);

    wrapper.find('button').at(1).prop('onClick')();

    expect(wrapper.find('input').at(0).prop('value')).toBe(displayName);
    expect(wrapper.find('input').at(1).prop('value')).toBe(studentNum);

    expect(onRequestClose).toHaveBeenCalledTimes(1);
    expect(onRequestClose).toHaveBeenLastCalledWith(false);
  });

  it('should render error and not reset input fields if user is new', () => {
    wrapper.setProps({
      isNewUser: true,
      initialDisplayName: displayName,
      initialStudentNum: studentNum
    });
    wrapper.find('input').at(0).prop('onChange')({
      target: { value: newDisplayName }
    });
    wrapper.find('input').at(1).prop('onChange')({
      target: { value: newStudentNum }
    });

    expect(wrapper.find('input').at(0).prop('value')).toBe(newDisplayName);
    expect(wrapper.find('input').at(1).prop('value')).toBe(newStudentNum);

    wrapper.find('button').at(1).prop('onClick')();

    expect(wrapper.find('input').at(0).prop('value')).toBe(newDisplayName);
    expect(wrapper.find('input').at(1).prop('value')).toBe(newStudentNum);

    expect(wrapper).toMatchSnapshot();
  });
});

describe('submit button', () => {
  const submitEvent = { preventDefault: () => {} };

  it('should render error if empty display name and student number on submit', () => {
    wrapper.find('form').prop('onSubmit')(submitEvent);

    expect(wrapper).toMatchSnapshot();
  });

  it('should render error if empty display name and incorrect format for student number', () => {
    wrapper.find('form').prop('onSubmit')(submitEvent);

    expect(wrapper).toMatchSnapshot();
  });

  it('should render error if empty display name', () => {
    wrapper = shallow(
      <SettingsModal
        startSetUserData={startSetUserData}
        initialStudentNum={studentNum}
        onRequestClose={onRequestClose}
      />
    );
    wrapper.find('form').prop('onSubmit')(submitEvent);

    expect(wrapper).toMatchSnapshot();
  });

  it('should render error if invalid student number', () => {
    wrapper = shallow(
      <SettingsModal
        startSetUserData={startSetUserData}
        initialDisplayName={displayName}
        onRequestClose={onRequestClose}
      />
    );
    wrapper.find('form').prop('onSubmit')(submitEvent);

    expect(wrapper).toMatchSnapshot();
  });

  it('should call startSetUserData and onRequestClose on valid submit', () => {
    wrapper = shallow(
      <SettingsModal
        startSetUserData={startSetUserData}
        initialDisplayName={displayName}
        initialStudentNum={studentNum}
        onRequestClose={onRequestClose}
      />
    );
    wrapper
      .find('form')
      .prop('onSubmit')(submitEvent)
      .then(() => {
        expect(wrapper).toMatchSnapshot();

        expect(startSetUserData).toHaveBeenCalledTimes(1);
        expect(startSetUserData).toHaveBeenLastCalledWith(
          displayName,
          studentNum
        );

        expect(onRequestClose).toHaveBeenCalledTimes(1);
        expect(onRequestClose).toHaveBeenLastCalledWith(true);
      });
  });
});
