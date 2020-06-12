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

export const groupOneDocCollection = jest.fn(() => groupOneTaskCollectionRef);

const groupOneDocRef = {
  get: groupOneDocGet,
  collection: groupOneDocCollection
};

export default groupOneDocRef;
