import tasks from '../../../fixtures/tasks';

export const groupTwoDocSnapshotGet = jest.fn(() =>
  Promise.resolve('groupTwo')
);

const groupTwoDocSnapshot = { get: groupTwoDocSnapshotGet };

export const groupTwoDocGet = jest.fn(() =>
  Promise.resolve(groupTwoDocSnapshot)
);

export const queryGroupTwoTaskSnapshot = [
  {
    id: tasks[2].id,
    data: jest.fn(() => tasks[2])
  }
];

export const groupTwoTaskCollectionGet = jest.fn(() =>
  Promise.resolve(queryGroupTwoTaskSnapshot)
);

const groupTwoTaskCollectionRef = { get: groupTwoTaskCollectionGet };

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
