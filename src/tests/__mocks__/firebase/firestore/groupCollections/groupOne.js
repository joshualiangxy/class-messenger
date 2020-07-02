import { groupTasks as tasks } from '../../../../fixtures/tasks';

export const groupOneDocSnapshotGet = jest.fn(() =>
  Promise.resolve('groupOne')
);

const groupOneDocSnapshot = { get: groupOneDocSnapshotGet };

export const groupOneDocGet = jest.fn(() =>
  Promise.resolve(groupOneDocSnapshot)
);

export const queryGroupOneTaskSnapshot = [
  {
    id: tasks[0].id,
    data: jest.fn(() => tasks[0]),
    get: jest.fn(field => tasks[0][field])
  }
];

export const groupOneTaskCollectionGet = jest.fn(() =>
  Promise.resolve(queryGroupOneTaskSnapshot)
);

export const groupOneTaskDocSet = jest.fn(() => Promise.resolve());

export const groupOneTaskDocUpdate = jest.fn(() => Promise.resolve());

export const groupOneTaskDocGet = jest.fn(() =>
  Promise.resolve(queryGroupOneTaskSnapshot[0])
);

export const groupOneTaskDocRef = {
  set: groupOneTaskDocSet,
  update: groupOneTaskDocUpdate,
  delete: jest.fn(() => Promise.resolve()),
  get: groupOneTaskDocGet
};

export const groupOneTaskDoc = jest.fn(() => groupOneTaskDocRef);

const groupOneTaskCollectionRef = {
  get: groupOneTaskCollectionGet,
  doc: groupOneTaskDoc
};

export const groupOneUserDocUpdate = jest.fn();

export const groupOneUserDocTwoGet = jest.fn(() =>
  Promise.resolve(queryGroupOneUserCollection[1])
);

const groupOneUserDocRefTwo = {
  update: groupOneUserDocUpdate,
  get: groupOneUserDocTwoGet
};

export const groupOneUserDocOneGet = jest.fn(() =>
  Promise.resolve(queryGroupOneUserCollection[0])
);

const groupOneUserDocRefOne = {
  update: groupOneUserDocUpdate,
  get: groupOneUserDocOneGet
};

export const groupOneUserDoc = jest.fn(uid => {
  switch (uid) {
    case 'testuid':
      return groupOneUserDocRefOne;
    case 'differentUser':
      return groupOneUserDocRefTwo;
  }
});

export const queryGroupOneUserCollection = [
  { id: 'testuid', get: jest.fn(() => true), exists: true },
  { id: 'differentUser', get: jest.fn(() => false), exists: true }
];

export const groupOneUserCollectionGet = jest.fn(() =>
  Promise.resolve(queryGroupOneUserCollection)
);

const groupOneUserCollectionRef = {
  doc: groupOneUserDoc,
  get: groupOneUserCollectionGet
};

export const groupOneDocCollection = jest.fn(collectionName => {
  switch (collectionName) {
    case 'tasks':
      return groupOneTaskCollectionRef;
    case 'users':
      return groupOneUserCollectionRef;
  }
});

const groupOneDocRef = {
  get: groupOneDocGet,
  collection: groupOneDocCollection
};

export default groupOneDocRef;
