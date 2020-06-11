import user from '../fixtures/user';
import tasks from '../fixtures/tasks';

export const emailToUidDoc = jest.fn(() => emailToUidDocRef);

export const emailToUidDocSet = jest.fn(() => Promise.resolve());

const emailToUidDocRef = { set: emailToUidDocSet };

const emailToUidCollectionRef = { doc: emailToUidDoc };

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

export const userDocCollection = jest.fn(() => userTaskCollectionRef);

export const userDoc = jest.fn(() => userDocRef);

export const userDocGet = jest.fn(() => Promise.resolve(userDocSnapshot));

export const userDocSet = jest.fn(() => Promise.resolve());

const userDocRef = {
  get: userDocGet,
  set: userDocSet,
  collection: userDocCollection
};

const userCollectionRef = { doc: userDoc };

export const userDocSnapshotData = jest.fn(() => user);

export const userDocSnapshotGet = jest.fn(() => user.groups);

const userDocSnapshot = { data: userDocSnapshotData, get: userDocSnapshotGet };

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

export const groupThreeDocCollection = jest.fn(
  () => groupThreeTaskCollectionRef
);

const groupThreeDocRef = {
  get: groupThreeDocGet,
  collection: groupThreeDocCollection
};

export const groupDoc = jest.fn(gid => {
  switch (gid) {
    case user.groups[0]:
      return groupOneDocRef;
    case user.groups[1]:
      return groupTwoDocRef;
    case user.groups[2]:
      return groupThreeDocRef;
  }
});

const groupCollectionRef = { doc: groupDoc };

export const collection = jest.fn(collectionName => {
  switch (collectionName) {
    case 'users':
      return userCollectionRef;
    case 'emailToUid':
      return emailToUidCollectionRef;
    case 'groups':
      return groupCollectionRef;
  }
});

const firestore = jest.fn(() => ({ collection }));

export const resetFirestore = () => {
  emailToUidDoc.mockClear();
  emailToUidDocSet.mockClear();
  userTaskDoc.mockClear();
  userTaskSet.mockClear();
  userTaskUpdate.mockClear();
  userTaskDocRef.delete.mockClear();
  queryUserTaskSnapshot[0].data.mockClear();
  userTaskCollectionGet.mockClear();
  userDocCollection.mockClear();
  userDoc.mockClear();
  userDocGet.mockClear();
  userDocSet.mockClear();
  userDocSnapshotData.mockClear();
  userDocSnapshotGet.mockClear();
  groupOneDocSnapshotGet.mockClear();
  groupOneDocGet.mockClear();
  queryGroupOneTaskSnapshot[0].data.mockClear();
  groupOneTaskCollectionGet.mockClear();
  groupOneDocCollection.mockClear();
  groupTwoDocSnapshotGet.mockClear();
  groupTwoDocGet.mockClear();
  queryGroupTwoTaskSnapshot[0].data.mockClear();
  groupTwoTaskCollectionGet.mockClear();
  groupTwoDocCollection.mockClear();
  groupThreeDocSnapshotGet.mockClear();
  groupThreeDocGet.mockClear();
  queryGroupThreeTaskSnapshot[0].data.mockClear();
  groupThreeTaskCollectionGet.mockClear();
  groupThreeDocCollection.mockClear();
  groupDoc.mockClear();
  collection.mockClear();
  firestore.mockClear();
};

export default firestore;
