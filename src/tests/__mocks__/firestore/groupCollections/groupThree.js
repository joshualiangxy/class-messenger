import { groupTasks as tasks } from '../../../fixtures/tasks';

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
    get: jest.fn(() => tasks[2].completed)
  }
];

export const groupThreeTaskCollectionGet = jest.fn(() =>
  Promise.resolve(queryGroupThreeTaskSnapshot)
);

export const groupThreeTaskDocSet = jest.fn(() => Promise.resolve());

export const groupThreeTaskDocUpdate = jest.fn(() => Promise.resolve());

export const groupThreeTaskDocRef = {
  set: groupThreeTaskDocSet,
  update: groupThreeTaskDocUpdate,
  delete: jest.fn(() => Promise.resolve())
};

export const groupThreeTaskDoc = jest.fn(() => groupThreeTaskDocRef);

const groupThreeTaskCollectionRef = {
  get: groupThreeTaskCollectionGet,
  doc: groupThreeTaskDoc
};

export const groupThreeUserDocUpdate = jest.fn();

const groupThreeUserDocRef = { update: groupThreeUserDocUpdate };

export const groupThreeUserDoc = jest.fn(() => groupThreeUserDocRef);

const groupThreeUserCollectionRef = { doc: groupThreeUserDoc };

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
