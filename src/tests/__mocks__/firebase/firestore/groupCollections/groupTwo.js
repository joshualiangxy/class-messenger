import { groupTasks as tasks } from '../../../../fixtures/tasks';

export const groupTwoDocSnapshotGet = jest.fn(() =>
  Promise.resolve('groupTwo')
);

const groupTwoDocSnapshot = { get: groupTwoDocSnapshotGet };

export const groupTwoDocGet = jest.fn(() =>
  Promise.resolve(groupTwoDocSnapshot)
);

export const queryGroupTwoTaskSnapshot = [
  {
    id: tasks[1].id,
    data: jest.fn(() => tasks[1]),
    get: jest.fn(field => tasks[1][field])
  }
];

export const groupTwoTaskCollectionGet = jest.fn(() =>
  Promise.resolve(queryGroupTwoTaskSnapshot)
);

export const groupTwoTaskDocSet = jest.fn(() => Promise.resolve());

export const groupTwoTaskDocUpdate = jest.fn(() => Promise.resolve());

export const groupTwoTaskDocGet = jest.fn(() =>
  Promise.resolve(queryGroupTwoTaskSnapshot[0])
);

export const groupTwoTaskDocRef = {
  set: groupTwoTaskDocSet,
  update: groupTwoTaskDocUpdate,
  delete: jest.fn(() => Promise.resolve()),
  get: groupTwoTaskDocGet
};

export const groupTwoTaskDoc = jest.fn(() => groupTwoTaskDocRef);

const groupTwoTaskCollectionRef = {
  get: groupTwoTaskCollectionGet,
  doc: groupTwoTaskDoc
};

export const groupTwoUserDocUpdate = jest.fn();

export const groupTwoUserDocGet = jest.fn(() =>
  Promise.resolve(queryGroupTwoUserCollection[0])
);

const groupTwoUserDocRef = {
  update: groupTwoUserDocUpdate,
  get: groupTwoUserDocGet
};

export const groupTwoUserDoc = jest.fn(() => groupTwoUserDocRef);

export const queryGroupTwoUserCollection = [
  { id: 'testuid', get: jest.fn(() => true), exists: true }
];

export const groupTwoUserCollectionGet = jest.fn(() =>
  Promise.resolve(queryGroupTwoUserCollection)
);

const groupTwoUserCollectionRef = {
  doc: groupTwoUserDoc,
  get: groupTwoUserCollectionGet
};

export const groupTwoDocCollection = jest.fn(collectionName => {
  switch (collectionName) {
    case 'tasks':
      return groupTwoTaskCollectionRef;
    case 'users':
      return groupTwoUserCollectionRef;
  }
});

const groupTwoDocRef = {
  get: groupTwoDocGet,
  collection: groupTwoDocCollection
};

export default groupTwoDocRef;
