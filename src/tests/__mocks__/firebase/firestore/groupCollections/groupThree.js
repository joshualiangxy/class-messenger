import { groupTasks as tasks } from '../../../../fixtures/tasks';

export const groupThreeDocSnapshotGet = jest.fn(() =>
  Promise.resolve('groupThree')
);

const groupThreeDocSnapshot = { get: groupThreeDocSnapshotGet };

export const groupThreeDocGet = jest.fn(() =>
  Promise.resolve(groupThreeDocSnapshot)
);

export const queryGroupThreeTaskSnapshot = [
  {
    id: tasks[2].id,
    data: jest.fn(() => tasks[2]),
    get: jest.fn(field => tasks[2][field])
  }
];

export const groupThreeTaskCollectionGet = jest.fn(() =>
  Promise.resolve(queryGroupThreeTaskSnapshot)
);

export const groupThreeTaskDocSet = jest.fn(() => Promise.resolve());

export const groupThreeTaskDocUpdate = jest.fn(() => Promise.resolve());

export const groupThreeTaskDocGet = jest.fn(() =>
  Promise.resolve(queryGroupThreeTaskSnapshot[0])
);

export const groupThreeTaskDocRef = {
  set: groupThreeTaskDocSet,
  update: groupThreeTaskDocUpdate,
  delete: jest.fn(() => Promise.resolve()),
  get: groupThreeTaskDocGet
};

export const groupThreeTaskDoc = jest.fn(() => groupThreeTaskDocRef);

const groupThreeTaskCollectionRef = {
  get: groupThreeTaskCollectionGet,
  doc: groupThreeTaskDoc
};

export const groupThreeUserDocUpdate = jest.fn();

export const groupThreeUserDocGet = jest.fn(() =>
  Promise.resolve(queryGroupThreeUserCollection[0])
);

const groupThreeUserDocRef = {
  update: groupThreeUserDocUpdate,
  get: groupThreeUserDocGet
};

export const groupThreeUserDoc = jest.fn(() => groupThreeUserDocRef);

export const queryGroupThreeUserCollection = [
  { id: 'testuid', get: jest.fn(() => true), exists: true }
];

export const groupThreeUserCollectionGet = jest.fn(() =>
  Promise.resolve(queryGroupThreeUserCollection)
);

const groupThreeUserCollectionRef = {
  doc: groupThreeUserDoc,
  get: groupThreeUserCollectionGet
};

export const groupThreeDocCollection = jest.fn(collectionName => {
  switch (collectionName) {
    case 'tasks':
      return groupThreeTaskCollectionRef;
    case 'users':
      return groupThreeUserCollectionRef;
  }
});

const groupThreeDocRef = {
  get: groupThreeDocGet,
  collection: groupThreeDocCollection
};

export default groupThreeDocRef;
