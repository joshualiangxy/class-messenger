import JSZip, { blob, data } from 'jszip';
import JSZipUtils from 'jszip-utils';
import { saveAs } from 'file-saver';
import createMockStore from '../../setupTests';
import {
  ref,
  put,
  listAll,
  itemOne,
  itemTwo,
  itemThree,
  prefixOne,
  prefixTwo,
  prefixThree
} from '../__mocks__/firebase/storage';
import { collection } from '../__mocks__/firebase/firestore';
import {
  renameFile,
  uploadFile,
  downloadFile,
  startRemoveUserFile,
  startRemoveTaskFile
} from '../../actions/files';
import { groupDoc } from '../__mocks__/firebase/firestore/groups';
import {
  groupOneDocCollection,
  groupOneTaskDoc,
  groupOneTaskDocGet
} from '../__mocks__/firebase/firestore/groupCollections/groupOne';
import { groupTasks } from '../fixtures/tasks';
import {
  groupThreeDocCollection,
  groupThreeTaskDoc,
  groupThreeTaskDocGet
} from '../__mocks__/firebase/firestore/groupCollections/groupThree';

jest.mock('file-saver');
JSZipUtils.getBinaryContent = jest.fn(() => Promise.resolve(data));

const fileName = 'foo.txt';
const file = new File(['foo'], fileName, { type: 'text/plain' });
const uid = 'testuid';
const studentNum = 'A0000000A';
const task = groupTasks[0];
const id = task.id;
const gid = task.gid;
const store = createMockStore({
  auth: { user: { uid } },
  user: { studentNum }
});

beforeEach(() => {
  jest.clearAllMocks();
  store.clearActions();
});

describe('rename file', () => {
  it('should rename file with a new name', () =>
    expect(renameFile(file, 'bar.txt')).toEqual(
      new File(['foo'], 'bar.txt', { type: 'text/plain' })
    ));
});

describe('upload file', () => {
  it('should upload file to firebase storage', () => {
    store.dispatch(uploadFile(file, id));

    expect(ref).toHaveBeenCalledTimes(1);
    expect(ref).toHaveBeenLastCalledWith(`${id}/${uid}/${fileName}`);

    expect(put).toHaveBeenCalledTimes(1);
    expect(put).toHaveBeenLastCalledWith(file);
  });

  it('should rename file before uploading if naming convention is specified', () => {
    const nameConvention = 'nameConvention';
    store.dispatch(uploadFile(file, id, nameConvention));

    expect(ref).toHaveBeenCalledTimes(1);
    expect(ref).toHaveBeenLastCalledWith(
      `${id}/${uid}/A0000000A_nameConvention.txt`
    );

    expect(put).toHaveBeenCalledTimes(1);
    expect(put).toHaveBeenLastCalledWith(file);
  });
});

describe('download files', () => {
  it('should download files from storage', () =>
    store.dispatch(downloadFile(gid, id)).then(() => {
      expect(collection).toHaveBeenCalledTimes(1);
      expect(collection).toHaveBeenLastCalledWith('groups');

      expect(groupDoc).toHaveBeenCalledTimes(1);
      expect(groupDoc).toHaveBeenLastCalledWith(gid);

      expect(groupOneDocCollection).toHaveBeenCalledTimes(1);
      expect(groupOneDocCollection).toHaveBeenLastCalledWith('tasks');

      expect(groupOneTaskDoc).toHaveBeenCalledTimes(1);
      expect(groupOneTaskDoc).toHaveBeenLastCalledWith(id);

      expect(groupOneTaskDocGet).toHaveBeenCalledTimes(1);

      expect(JSZip).toHaveBeenCalledTimes(1);

      expect(JSZipUtils.getBinaryContent).toHaveBeenCalledTimes(1);
      expect(JSZipUtils.getBinaryContent).toHaveBeenLastCalledWith(
        task.downloadURLs.testuid.downloadURL
      );

      const zip = new JSZip();

      expect(zip.file).toHaveBeenCalledTimes(1);
      expect(zip.file).toHaveBeenLastCalledWith(
        task.downloadURLs.testuid.fileName,
        data,
        {
          base64: true
        }
      );

      expect(zip.generateAsync).toHaveBeenCalledTimes(1);
      expect(zip.generateAsync).toHaveBeenLastCalledWith({ type: 'blob' });

      expect(saveAs).toHaveBeenCalledTimes(1);
      expect(saveAs).toHaveBeenLastCalledWith(blob, 'submissions.zip');
    }));

  it('should not add any files to zip if no download urls are found', () =>
    store
      .dispatch(downloadFile(groupTasks[2].gid, groupTasks[2].id))
      .then(() => {
        expect(collection).toHaveBeenCalledTimes(1);
        expect(collection).toHaveBeenLastCalledWith('groups');

        expect(groupDoc).toHaveBeenCalledTimes(1);
        expect(groupDoc).toHaveBeenLastCalledWith(groupTasks[2].gid);

        expect(groupThreeDocCollection).toHaveBeenCalledTimes(1);
        expect(groupThreeDocCollection).toHaveBeenLastCalledWith('tasks');

        expect(groupThreeTaskDoc).toHaveBeenCalledTimes(1);
        expect(groupThreeTaskDoc).toHaveBeenLastCalledWith(groupTasks[2].id);

        expect(groupThreeTaskDocGet).toHaveBeenCalledTimes(1);

        expect(JSZip).toHaveBeenCalledTimes(1);

        const zip = new JSZip();

        expect(JSZipUtils.getBinaryContent).toHaveBeenCalledTimes(0);

        expect(zip.generateAsync).toHaveBeenCalledTimes(1);
        expect(zip.generateAsync).toHaveBeenLastCalledWith({ type: 'blob' });

        expect(saveAs).toHaveBeenCalledTimes(1);
        expect(saveAs).toHaveBeenLastCalledWith(blob, 'submissions.zip');
      }));
});

describe('remove user files', () => {
  it('should have removed the user files for the task in firebase storage', () =>
    store.dispatch(startRemoveUserFile(id, uid)).then(() => {
      expect(ref).toHaveBeenCalledTimes(1);
      expect(ref).toHaveBeenLastCalledWith(`${id}/${uid}`);

      expect(listAll).toHaveBeenCalledTimes(1);

      expect(itemOne.delete).toHaveBeenCalledTimes(1);
      expect(itemTwo.delete).toHaveBeenCalledTimes(1);
      expect(itemThree.delete).toHaveBeenCalledTimes(1);
    }));
});

describe('remove task files', () => {
  it('should have removed the user files for the task in firebase storage', () =>
    store.dispatch(startRemoveTaskFile(id)).then(() => {
      expect(ref).toHaveBeenCalledTimes(4);
      expect(ref).toHaveBeenNthCalledWith(1, id);
      expect(ref).toHaveBeenNthCalledWith(2, `${id}/${prefixOne.name}`);
      expect(ref).toHaveBeenNthCalledWith(3, `${id}/${prefixTwo.name}`);
      expect(ref).toHaveBeenNthCalledWith(4, `${id}/${prefixThree.name}`);

      expect(listAll).toHaveBeenCalledTimes(4);

      expect(itemOne.delete).toHaveBeenCalledTimes(3);
      expect(itemTwo.delete).toHaveBeenCalledTimes(3);
      expect(itemThree.delete).toHaveBeenCalledTimes(3);
    }));
});
