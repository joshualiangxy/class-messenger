import tasks from '../../../fixtures/tasks';

export const groupOneDocSnapshotGet = jest.fn(() =>
  Promise.resolve('groupOne')
);

const groupOneDocSnapshot = { get: groupOneDocSnapshotGet };

export const groupOneDocGet = jest.fn(() =>
  Promise.resolve(groupOneDocSnapshot)
);

export const queryGroupOneTaskSnapshot = [
  {
    id: tasks[1].id,
    data: jest.fn(() => tasks[1])
  }
];

export const groupOneTaskCollectionGet = jest.fn(() =>
  Promise.resolve(queryGroupOneTaskSnapshot)
);

const groupOneTaskCollectionRef = { get: groupOneTaskCollectionGet };

export const groupOneUserDocUpdate = jest.fn();

const groupOneUserDocRef = { update: groupOneUserDocUpdate };

export const groupOneUserDoc = jest.fn(() => groupOneUserDocRef);

const groupOneUserCollectionRef = { doc: groupOneUserDoc };

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
