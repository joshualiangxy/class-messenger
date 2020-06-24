import { groupTasks as tasks } from '../../../fixtures/tasks';

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
    get: jest.fn(() => tasks[1].completed)
  }
];

export const groupTwoTaskCollectionGet = jest.fn(() =>
  Promise.resolve(queryGroupTwoTaskSnapshot)
);

export const groupTwoTaskDocSet = jest.fn(() => Promise.resolve());

export const groupTwoTaskDocUpdate = jest.fn(() => Promise.resolve());

export const groupTwoTaskDocRef = {
  set: groupTwoTaskDocSet,
  update: groupTwoTaskDocUpdate,
  delete: jest.fn(() => Promise.resolve())
};

export const groupTwoTaskDoc = jest.fn(() => groupTwoTaskDocRef);

const groupTwoTaskCollectionRef = {
  get: groupTwoTaskCollectionGet,
  doc: groupTwoTaskDoc
};

export const groupTwoUserDocUpdate = jest.fn();

const groupTwoUserDocRef = { update: groupTwoUserDocUpdate };

export const groupTwoUserDoc = jest.fn(() => groupTwoUserDocRef);

const groupTwoUserCollectionRef = { doc: groupTwoUserDoc };

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
