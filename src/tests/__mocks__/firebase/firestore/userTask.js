import tasks from '../../../fixtures/tasks';

export const userTaskDoc = jest.fn(() => userTaskDocRef);

export const userTaskSet = jest.fn(() => Promise.resolve());

export const userTaskUpdate = jest.fn(() => Promise.resolve());

export const userTaskDocRef = {
  set: userTaskSet,
  delete: jest.fn(() => Promise.resolve()),
  update: userTaskUpdate
};

export const queryUserTaskSnapshot = [
  {
    id: tasks[0].id,
    data: jest.fn(() => tasks[0])
  }
];

export const userTaskCollectionGet = jest.fn(() =>
  Promise.resolve(queryUserTaskSnapshot)
);

const userTaskCollectionRef = { doc: userTaskDoc, get: userTaskCollectionGet };

export default userTaskCollectionRef;
