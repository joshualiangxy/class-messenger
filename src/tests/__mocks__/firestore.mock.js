import user from '../fixtures/user';

export const set = jest.fn(() => Promise.resolve());

export const snapshot = {
  data: jest.fn(() => ({
    displayName: user.displayName,
    studentNum: user.studentNum
  }))
};

export const get = jest.fn(() => Promise.resolve(snapshot));

export const doc = jest.fn(() => ({
  collection,
  get,
  set
}));

export const collection = jest.fn(() => ({ doc }));

const firestore = jest.fn(() => ({ collection }));

export const resetFirestore = () => {
  set.mockClear();
  snapshot.data.mockClear();
  get.mockClear();
  doc.mockClear();
  collection.mockClear();
  firestore.mockClear();
};

export default firestore;
