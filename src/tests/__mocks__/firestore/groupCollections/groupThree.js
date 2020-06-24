import tasks from '../../../fixtures/tasks';

export const groupThreeDocSnapshotGet = jest.fn(() =>
  Promise.resolve('groupThree')
);

const groupThreeDocSnapshot = { get: groupThreeDocSnapshotGet };

export const groupThreeDocGet = jest.fn(() =>
  Promise.resolve(groupThreeDocSnapshot)
);

export const queryGroupThreeTaskSnapshot = [
  {
    id: tasks[3].id,
    data: jest.fn(() => tasks[3])
  }
];

export const groupThreeTaskCollectionGet = jest.fn(() =>
  Promise.resolve(queryGroupThreeTaskSnapshot)
);

const groupThreeTaskCollectionRef = { get: groupThreeTaskCollectionGet };

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
