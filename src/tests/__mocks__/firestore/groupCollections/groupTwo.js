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

export const groupTwoDocCollection = jest.fn(() => groupTwoTaskCollectionRef);

const groupTwoDocRef = {
  get: groupTwoDocGet,
  collection: groupTwoDocCollection
};

export default groupTwoDocRef;
