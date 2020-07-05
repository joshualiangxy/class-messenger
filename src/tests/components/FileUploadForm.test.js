import React from 'react';
import { JSDOM } from 'jsdom';
import { shallow } from 'enzyme';
import { FileUploadForm } from '../../components/FileUploadForm';
import { groupTasks } from '../fixtures/tasks';

const dom = new JSDOM();
global.document = dom.window.document;
global.window = dom.window;

let wrapper;
let files = ['file'];
const groupTask = groupTasks[2];
const id = groupTask.id;
const uid = 'testuid';
const TaskEvent = { STATE_CHANGED: 'STATE_CHANGED' };
const startRemoveUserFile = jest.fn();
const startUpdateDownloadURL = jest.fn();
const getDownloadURL = jest.fn(() => Promise.resolve('www.download.com'));
const uploadTask = {
  on: jest.fn(),
  snapshot: { ref: { name: 'fileName', getDownloadURL } }
};
const uploadFile = jest.fn(() => uploadTask);
const element = { files };
const submitEvent = {
  preventDefault: jest.fn(),
  persist: jest.fn(),
  target: { reset: jest.fn() }
};

beforeEach(() => {
  jest.clearAllMocks();
  uploadTask.on.mockImplementation((state, observer, error, callback) =>
    Promise.resolve(observer()).then(() => callback())
  );
  global.document.getElementById = jest.fn(() => element);

  files = ['file'];
  wrapper = shallow(
    <FileUploadForm
      id={id}
      uid={uid}
      uploadFile={uploadFile}
      TaskEvent={TaskEvent}
      startUpdateDownloadURL={startUpdateDownloadURL}
      startRemoveUserFile={startRemoveUserFile}
      fileExists={false}
    />
  );
});

describe('render', () => {
  it('should render FileUploadForm', () => expect(wrapper).toMatchSnapshot());
});

describe('error', () => {
  it('should render unauthorized error', () => {
    uploadTask.on.mockImplementation((state, observer, error, callback) =>
      Promise.resolve(observer()).then(() =>
        error({ code: 'storage/unauthorized' })
      )
    );

    return wrapper
      .find('form')
      .prop('onSubmit')(submitEvent)
      .then(() => expect(wrapper).toMatchSnapshot());
  });

  it('should render cancelled error', () => {
    uploadTask.on.mockImplementation((state, observer, error, callback) =>
      Promise.resolve(observer()).then(() =>
        error({ code: 'storage/canceled' })
      )
    );

    return wrapper
      .find('form')
      .prop('onSubmit')(submitEvent)
      .then(() => expect(wrapper).toMatchSnapshot());
  });

  it('should render default error', () => {
    uploadTask.on.mockImplementation((state, observer, error, callback) =>
      Promise.resolve(observer()).then(() => error({ code: 'default' }))
    );

    return wrapper
      .find('form')
      .prop('onSubmit')(submitEvent)
      .then(() => expect(wrapper).toMatchSnapshot());
  });

  it('should render error when no file is selected', () => {
    files.pop();

    wrapper.find('form').prop('onSubmit')(submitEvent);

    expect(wrapper).toMatchSnapshot();
  });
});

describe('remove existing file', () => {
  it('should remove existing file if file already exists', () => {
    wrapper.setProps({ fileExists: true });

    return wrapper
      .find('form')
      .prop('onSubmit')(submitEvent)
      .then(() => {
        expect(startRemoveUserFile).toHaveBeenCalledTimes(1);
        expect(startRemoveUserFile).toHaveBeenLastCalledWith(uid);
      });
  });

  it('should not remove any files if file does not exist', () =>
    wrapper
      .find('form')
      .prop('onSubmit')(submitEvent)
      .then(() => expect(startRemoveUserFile).toHaveBeenCalledTimes(0)));
});

describe('upload form', () => {
  it('should change button to "Uploading..." during upload', () => {
    uploadTask.on.mockImplementation((state, observer, error, callback) =>
      Promise.resolve(observer())
    );

    return wrapper
      .find('form')
      .prop('onSubmit')(submitEvent)
      .then(() => {
        expect(uploadFile).toHaveBeenCalledTimes(1);
        expect(uploadFile).toHaveBeenLastCalledWith(files[0]);

        expect(wrapper).toMatchSnapshot();
      });
  });

  it('should update download url', () =>
    wrapper
      .find('form')
      .prop('onSubmit')(submitEvent)
      .then(() => {
        expect(uploadFile).toHaveBeenCalledTimes(1);
        expect(uploadFile).toHaveBeenLastCalledWith(files[0]);

        expect(getDownloadURL).toHaveBeenCalledTimes(1);

        return new Promise(resolve =>
          setTimeout(() => {
            expect(startUpdateDownloadURL).toHaveBeenCalledTimes(1);
            expect(startUpdateDownloadURL).toHaveBeenLastCalledWith(
              'www.download.com',
              'fileName'
            );
            resolve();
          }, 200)
        );
      }));

  it('should remove error, set uploading to false and reset input after upload', () =>
    wrapper
      .find('form')
      .prop('onSubmit')(submitEvent)
      .then(() => {
        expect(wrapper).toMatchSnapshot();

        expect(uploadFile).toHaveBeenCalledTimes(1);
        expect(uploadFile).toHaveBeenLastCalledWith(files[0]);

        new Promise(resolve =>
          setTimeout(() => {
            expect(wrapper).toMatchSnapshot();
            expect(submitEvent.target.reset).toHaveBeenCalledTimes(1);
            resolve();
          })
        );
      }));
});
