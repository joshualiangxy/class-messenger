import user from '../../../fixtures/user';
import userTaskCollectionRef from './userTask';

export const userDocCollection = jest.fn(() => userTaskCollectionRef);

export const userDoc = jest.fn(() => userDocRef);

export const userDocGet = jest.fn(() => Promise.resolve(userDocSnapshot));

export const userDocSet = jest.fn(() => Promise.resolve());

export const userDocUpdate = jest.fn(() => Promise.resolve());

const userDocRef = {
  get: userDocGet,
  set: userDocSet,
  update: userDocUpdate,
  collection: userDocCollection
};

export const userDocSnapshotData = jest.fn(() => user);

export const userDocSnapshotGet = jest.fn(field => {
  switch (field) {
    case 'displayName':
      return user.displayName;
    case 'studentNum':
      return user.studentNum;
    case 'groups':
      return user.groups;
  }
});

const userDocSnapshot = { data: userDocSnapshotData, get: userDocSnapshotGet, ref: {
  id: 'testuid'
} };

const userCollectionRef = { doc: userDoc };

export default userCollectionRef;
