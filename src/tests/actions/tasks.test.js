import createMockStore from '../../setupTests';
import tasks, { groupTasks } from '../fixtures/tasks';
import user from '../fixtures/user';
import {
  collection,
  FieldValue,
  deleteReturnValue
} from '../__mocks__/firebase/firestore';
import {
  userDoc,
  userDocGet,
  userDocCollection,
  userDocSnapshotGet
} from '../__mocks__/firebase/firestore/users';
import {
  userTaskDoc,
  userTaskSet,
  userTaskDocRef,
  userTaskUpdate,
  userTaskCollectionGet,
  queryUserTaskSnapshot
} from '../__mocks__/firebase/firestore/userTask';
import { groupDoc } from '../__mocks__/firebase/firestore/groups';
import {
  groupOneDocGet,
  groupOneDocCollection,
  groupOneDocSnapshotGet,
  groupOneTaskCollectionGet,
  queryGroupOneTaskSnapshot,
  groupOneTaskDoc,
  groupOneTaskDocGet,
  groupOneTaskDocSet,
  groupOneTaskDocRef,
  groupOneTaskDocUpdate,
  groupOneUserCollectionGet,
  queryGroupOneUserCollection,
  groupOneUserDoc,
  groupOneUserDocOneGet,
  groupOneUserDocTwoGet
} from '../__mocks__/firebase/firestore/groupCollections/groupOne';
import {
  groupTwoDocGet,
  groupTwoDocCollection,
  groupTwoDocSnapshotGet,
  groupTwoTaskCollectionGet,
  queryGroupTwoTaskSnapshot,
  groupTwoTaskDoc,
  groupTwoTaskDocSet,
  groupTwoTaskDocRef,
  groupTwoTaskDocGet,
  groupTwoUserCollectionGet,
  queryGroupTwoUserCollection,
  groupTwoUserDoc,
  groupTwoUserDocGet
} from '../__mocks__/firebase/firestore/groupCollections/groupTwo';
import {
  groupThreeDocGet,
  groupThreeDocCollection,
  groupThreeDocSnapshotGet,
  groupThreeTaskCollectionGet,
  queryGroupThreeTaskSnapshot,
  groupThreeUserCollectionGet,
  groupThreeTaskDoc,
  groupThreeTaskDocSet,
  queryGroupThreeUserCollection
} from '../__mocks__/firebase/firestore/groupCollections/groupThree';
import {
  addTask,
  startAddPersonalTask,
  removeTask,
  startRemovePersonalTask,
  editTask,
  startEditPersonalTask,
  setTasks,
  startSetTasks,
  toggleCompleted,
  startToggleCompletedPersonal,
  removeTaskData,
  startAddGroupTask,
  startRemoveGroupTask,
  startEditGroupTask,
  startRemoveDownloadURL,
  removeDownloadURL,
  startToggleCompletedGroup,
  getAllGroupTasks,
  updateDownloadURL,
  startUpdateDownloadURL
} from '../../actions/tasks';

const uid = 'testuid';
const task = tasks[0];
const id = task.id;
const groupName = 'Test Group';
const groupTask = groupTasks[0];
const groupTaskId = groupTask.id;
const groupTaskGid = groupTask.gid;
let store;

beforeEach(() => {
  store = createMockStore({
    auth: {
      user: { uid }
    },
    tasks: [{ ...groupTask, completed: false }]
  });
  jest.clearAllMocks();
  store.clearActions();
});

afterEach(() => {
  groupTasks[2].completed = { [uid]: false };
});

describe('add task', () => {
  it('should generate action object with task', () =>
    expect(addTask(task)).toEqual({ type: 'ADD_TASK', task }));

  it('should add personal task to firestore', () =>
    store.dispatch(startAddPersonalTask(task)).then(() => {
      const actions = store.getActions();

      expect(collection).toHaveBeenCalledTimes(1);
      expect(collection).toHaveBeenLastCalledWith('users');

      expect(userDoc).toHaveBeenCalledTimes(1);
      expect(userDoc).toHaveBeenLastCalledWith(uid);

      expect(userDocCollection).toHaveBeenCalledTimes(1);
      expect(userDocCollection).toHaveBeenLastCalledWith('tasks');

      expect(userTaskDoc).toHaveBeenCalledTimes(1);
      expect(userTaskDoc).toHaveBeenLastCalledWith(id);

      expect(userTaskSet).toHaveBeenCalledTimes(1);
      expect(userTaskSet).toHaveBeenLastCalledWith(task);

      expect(actions).toHaveLength(1);
      expect(actions[0]).toEqual(addTask(task));
    }));

  it('should add group task to firestore', () =>
    store.dispatch(startAddGroupTask(groupTask, groupName)).then(isAdmin => {
      const actions = store.getActions();

      expect(collection).toHaveBeenCalledTimes(1);
      expect(collection).toHaveBeenLastCalledWith('groups');

      expect(groupDoc).toHaveBeenCalledTimes(1);
      expect(groupDoc).toHaveBeenLastCalledWith(groupTaskGid);

      expect(groupOneDocCollection).toHaveBeenCalledTimes(2);
      expect(groupOneDocCollection).toHaveBeenNthCalledWith(1, 'users');
      expect(groupOneDocCollection).toHaveBeenNthCalledWith(2, 'tasks');

      expect(groupOneUserCollectionGet).toHaveBeenCalledTimes(1);

      expect(groupOneTaskDoc).toHaveBeenCalledTimes(1);
      expect(groupOneTaskDoc).toHaveBeenLastCalledWith(groupTaskId);

      expect(groupOneTaskDocSet).toHaveBeenCalledTimes(1);
      expect(groupOneTaskDocSet).toHaveBeenLastCalledWith(groupTask);

      expect(actions).toHaveLength(1);
      expect(actions[0]).toEqual(
        addTask({ ...groupTask, groupName, completed: false })
      );

      expect(isAdmin).toBe(true);
    }));

  it('should not add group task to store if user not involved', () =>
    store
      .dispatch(startAddGroupTask(groupTasks[1], groupName))
      .then(isAdmin => {
        const actions = store.getActions();

        expect(collection).toHaveBeenCalledTimes(1);
        expect(collection).toHaveBeenLastCalledWith('groups');

        expect(groupDoc).toHaveBeenCalledTimes(1);
        expect(groupDoc).toHaveBeenLastCalledWith(groupTasks[1].gid);

        expect(groupTwoDocCollection).toHaveBeenCalledTimes(2);
        expect(groupTwoDocCollection).toHaveBeenNthCalledWith(1, 'users');
        expect(groupTwoDocCollection).toHaveBeenNthCalledWith(2, 'tasks');

        expect(groupTwoUserCollectionGet).toHaveBeenCalledTimes(1);

        expect(queryGroupTwoUserCollection[0].get).toHaveBeenLastCalledWith(
          'admin'
        );

        expect(groupTwoTaskDoc).toHaveBeenCalledTimes(1);
        expect(groupTwoTaskDoc).toHaveBeenLastCalledWith(groupTasks[1].id);

        expect(groupTwoTaskDocSet).toHaveBeenCalledTimes(1);
        expect(groupTwoTaskDocSet).toHaveBeenLastCalledWith(groupTasks[1]);

        expect(actions).toHaveLength(0);

        expect(isAdmin).toBe(true);
      }));

  it('should not include user if user not found in group', () =>
    store
      .dispatch(
        startAddGroupTask(
          {
            ...groupTasks[2],
            completed: { testuid: false, notPresent: false }
          },
          groupName
        )
      )
      .then(isAdmin => {
        const actions = store.getActions();

        expect(collection).toHaveBeenCalledTimes(1);
        expect(collection).toHaveBeenLastCalledWith('groups');

        expect(groupDoc).toHaveBeenCalledTimes(1);
        expect(groupDoc).toHaveBeenLastCalledWith(groupTasks[2].gid);

        expect(groupThreeDocCollection).toHaveBeenCalledTimes(2);
        expect(groupThreeDocCollection).toHaveBeenNthCalledWith(1, 'users');
        expect(groupThreeDocCollection).toHaveBeenNthCalledWith(2, 'tasks');

        expect(groupThreeUserCollectionGet).toHaveBeenCalledTimes(1);

        expect(queryGroupThreeUserCollection[0].get).toHaveBeenLastCalledWith(
          'admin'
        );

        expect(groupThreeTaskDoc).toHaveBeenCalledTimes(1);
        expect(groupThreeTaskDoc).toHaveBeenLastCalledWith(groupTasks[2].id);

        expect(groupThreeTaskDocSet).toHaveBeenCalledTimes(1);
        expect(groupThreeTaskDocSet).toHaveBeenLastCalledWith(groupTasks[2]);

        expect(actions).toHaveLength(1);
        expect(actions[0]).toEqual(
          addTask({ ...groupTasks[2], groupName, completed: false })
        );

        expect(isAdmin).toBe(true);
      }));

  it('should not add task if user is not admin', () => {
    const uid = 'differentUser';

    store = createMockStore({
      auth: {
        user: { uid }
      },
      tasks: [{ ...groupTask, completed: false }]
    });

    return store
      .dispatch(startAddGroupTask(groupTask, groupName))
      .then(isAdmin => {
        expect(collection).toHaveBeenCalledTimes(1);
        expect(collection).toHaveBeenLastCalledWith('groups');

        expect(groupDoc).toHaveBeenCalledTimes(1);
        expect(groupDoc).toHaveBeenLastCalledWith(groupTaskGid);

        expect(groupOneDocCollection).toHaveBeenCalledTimes(1);
        expect(groupOneDocCollection).toHaveBeenLastCalledWith('users');

        expect(queryGroupOneUserCollection[1].get).toHaveBeenCalledTimes(1);
        expect(queryGroupOneUserCollection[1].get).toHaveBeenLastCalledWith(
          'admin'
        );

        expect(isAdmin).toBe(false);
      });
  });
});

describe('remove task', () => {
  it('should generate action object', () =>
    expect(removeTask(id)).toEqual({ type: 'REMOVE_TASK', id }));

  it('should remove personal task from firestore', () =>
    store.dispatch(startRemovePersonalTask(id)).then(() => {
      const actions = store.getActions();

      expect(collection).toHaveBeenCalledTimes(1);
      expect(collection).toHaveBeenLastCalledWith('users');

      expect(userDoc).toHaveBeenCalledTimes(1);
      expect(userDoc).toHaveBeenLastCalledWith(uid);

      expect(userDocCollection).toHaveBeenCalledTimes(1);
      expect(userDocCollection).toHaveBeenLastCalledWith('tasks');

      expect(userTaskDoc).toHaveBeenCalledTimes(1);
      expect(userTaskDoc).toHaveBeenLastCalledWith(id);

      expect(userTaskDocRef.delete).toHaveBeenCalledTimes(1);

      expect(actions).toHaveLength(1);
      expect(actions[0]).toEqual(removeTask(id));
    }));

  it('should remove group task from firestore', () =>
    store
      .dispatch(startRemoveGroupTask(groupTaskGid, groupTaskId))
      .then(isAdmin => {
        const actions = store.getActions();

        expect(collection).toHaveBeenCalledTimes(1);
        expect(collection).toHaveBeenLastCalledWith('groups');

        expect(groupDoc).toHaveBeenCalledTimes(1);
        expect(groupDoc).toHaveBeenLastCalledWith(groupTaskGid);

        expect(groupOneDocCollection).toHaveBeenCalledTimes(2);
        expect(groupOneDocCollection).toHaveBeenNthCalledWith(1, 'users');
        expect(groupOneDocCollection).toHaveBeenNthCalledWith(2, 'tasks');

        expect(groupOneUserDoc).toHaveBeenCalledTimes(1);
        expect(groupOneUserDoc).toHaveBeenLastCalledWith(uid);

        expect(groupOneUserDocOneGet).toHaveBeenCalledTimes(1);

        expect(queryGroupOneUserCollection[0].get).toHaveBeenCalledTimes(1);
        expect(queryGroupOneUserCollection[0].get).toHaveBeenLastCalledWith(
          'admin'
        );

        expect(groupOneTaskDoc).toHaveBeenCalledTimes(1);
        expect(groupOneTaskDoc).toHaveBeenLastCalledWith(groupTaskId);

        expect(groupOneTaskDocRef.delete).toHaveBeenCalledTimes(1);

        expect(actions).toHaveLength(1);
        expect(actions[0]).toEqual(removeTask(groupTaskId));

        expect(isAdmin).toBe(true);
      }));

  it('should not remove task from store if user is not involved', () =>
    store
      .dispatch(startRemoveGroupTask(groupTasks[1].gid, groupTasks[1].id))
      .then(isAdmin => {
        const actions = store.getActions();

        expect(collection).toHaveBeenCalledTimes(1);
        expect(collection).toHaveBeenLastCalledWith('groups');

        expect(groupDoc).toHaveBeenCalledTimes(1);
        expect(groupDoc).toHaveBeenLastCalledWith(groupTasks[1].gid);

        expect(groupTwoDocCollection).toHaveBeenCalledTimes(2);
        expect(groupTwoDocCollection).toHaveBeenNthCalledWith(1, 'users');
        expect(groupTwoDocCollection).toHaveBeenNthCalledWith(2, 'tasks');

        expect(groupTwoUserDoc).toHaveBeenCalledTimes(1);
        expect(groupTwoUserDoc).toHaveBeenLastCalledWith(uid);

        expect(groupTwoUserDocGet).toHaveBeenCalledTimes(1);

        expect(queryGroupTwoUserCollection[0].get).toHaveBeenCalledTimes(1);
        expect(queryGroupTwoUserCollection[0].get).toHaveBeenLastCalledWith(
          'admin'
        );

        expect(groupTwoTaskDoc).toHaveBeenCalledTimes(1);
        expect(groupTwoTaskDoc).toHaveBeenLastCalledWith(groupTasks[1].id);

        expect(groupTwoTaskDocRef.delete).toHaveBeenCalledTimes(1);

        expect(actions).toHaveLength(0);

        expect(isAdmin).toBe(true);
      }));

  it('should not remove task if user is not admin', () => {
    const uid = 'differentUser';

    store = createMockStore({
      auth: {
        user: { uid }
      },
      tasks: [{ ...groupTask, completed: false }]
    });

    return store
      .dispatch(startRemoveGroupTask(groupTaskGid, groupTaskId))
      .then(isAdmin => {
        expect(collection).toHaveBeenCalledTimes(1);
        expect(collection).toHaveBeenLastCalledWith('groups');

        expect(groupDoc).toHaveBeenCalledTimes(1);
        expect(groupDoc).toHaveBeenLastCalledWith(groupTaskGid);

        expect(groupOneDocCollection).toHaveBeenCalledTimes(1);
        expect(groupOneDocCollection).toHaveBeenLastCalledWith('users');

        expect(groupOneUserDoc).toHaveBeenCalledTimes(1);
        expect(groupOneUserDoc).toHaveBeenLastCalledWith(uid);

        expect(groupOneUserDocTwoGet).toHaveBeenCalledTimes(1);

        expect(queryGroupOneUserCollection[1].get).toHaveBeenCalledTimes(1);
        expect(queryGroupOneUserCollection[1].get).toHaveBeenLastCalledWith(
          'admin'
        );

        expect(isAdmin).toBe(false);
      });
  });
});

describe('edit task', () => {
  const updates = tasks[1];
  const groupUpdates = Object.assign({}, groupTask);
  groupUpdates.description = '';
  groupUpdates.title = 'New title';

  it('should generate action object', () =>
    expect(editTask(id, updates)).toEqual({ type: 'EDIT_TASK', id, updates }));

  it('should update personal task in firestore', () =>
    store.dispatch(startEditPersonalTask(id, updates)).then(() => {
      const actions = store.getActions();

      expect(collection).toHaveBeenCalledTimes(1);
      expect(collection).toHaveBeenLastCalledWith('users');

      expect(userDoc).toHaveBeenCalledTimes(1);
      expect(userDoc).toHaveBeenLastCalledWith(uid);

      expect(userTaskSet).toHaveBeenCalledTimes(1);
      expect(userTaskSet).toHaveBeenLastCalledWith(updates);

      expect(actions).toHaveLength(1);
      expect(actions[0]).toEqual(editTask(id, updates));
    }));

  it('should update group task in firestore', () =>
    store
      .dispatch(
        startEditGroupTask(groupTaskId, groupUpdates, groupName, groupTask)
      )
      .then(isAdmin => {
        const actions = store.getActions();

        expect(collection).toHaveBeenCalledTimes(1);
        expect(collection).toHaveBeenLastCalledWith('groups');

        expect(groupDoc).toHaveBeenCalledTimes(1);
        expect(groupDoc).toHaveBeenLastCalledWith(groupTaskGid);

        expect(groupOneDocCollection).toHaveBeenCalledTimes(2);
        expect(groupOneDocCollection).toHaveBeenNthCalledWith(1, 'users');
        expect(groupOneDocCollection).toHaveBeenNthCalledWith(2, 'tasks');

        expect(groupOneUserCollectionGet).toHaveBeenCalledTimes(1);

        expect(queryGroupOneUserCollection[0].get).toHaveBeenCalledTimes(1);
        expect(queryGroupOneUserCollection[0].get).toHaveBeenLastCalledWith(
          'admin'
        );

        expect(groupOneTaskDoc).toHaveBeenCalledTimes(1);
        expect(groupOneTaskDoc).toHaveBeenLastCalledWith(groupTaskId);

        expect(groupOneTaskDocSet).toHaveBeenCalledTimes(1);
        expect(groupOneTaskDocSet).toHaveBeenLastCalledWith(groupUpdates);

        expect(actions).toHaveLength(1);
        expect(actions[0]).toEqual(
          editTask(groupTaskId, {
            ...groupUpdates,
            groupName,
            completed: false
          })
        );

        expect(isAdmin).toBe(true);
      }));

  it('should dispatch add task if user is involved and task is not found in store', () => {
    store = createMockStore({
      auth: {
        user: { uid }
      },
      tasks: []
    });

    return store
      .dispatch(
        startEditGroupTask(groupTaskId, groupUpdates, groupName, groupTask)
      )
      .then(isAdmin => {
        const actions = store.getActions();

        expect(collection).toHaveBeenCalledTimes(1);
        expect(collection).toHaveBeenLastCalledWith('groups');

        expect(groupDoc).toHaveBeenCalledTimes(1);
        expect(groupDoc).toHaveBeenLastCalledWith(groupTaskGid);

        expect(groupOneDocCollection).toHaveBeenCalledTimes(2);
        expect(groupOneDocCollection).toHaveBeenNthCalledWith(1, 'users');
        expect(groupOneDocCollection).toHaveBeenNthCalledWith(2, 'tasks');

        expect(groupOneUserCollectionGet).toHaveBeenCalledTimes(1);

        expect(queryGroupOneUserCollection[0].get).toHaveBeenCalledTimes(1);
        expect(queryGroupOneUserCollection[0].get).toHaveBeenLastCalledWith(
          'admin'
        );

        expect(groupOneTaskDoc).toHaveBeenCalledTimes(1);
        expect(groupOneTaskDoc).toHaveBeenLastCalledWith(groupTaskId);

        expect(groupOneTaskDocSet).toHaveBeenCalledTimes(1);
        expect(groupOneTaskDocSet).toHaveBeenLastCalledWith(groupUpdates);

        expect(actions).toHaveLength(1);
        expect(actions[0]).toEqual(
          addTask({
            ...groupUpdates,
            groupName,
            completed: false
          })
        );

        expect(isAdmin).toBe(true);
      });
  });

  it('should dispatch remove task if task was in store, but user is no longer involved', () => {
    groupUpdates.completed = {};

    return store
      .dispatch(
        startEditGroupTask(groupTaskId, groupUpdates, groupName, groupTask)
      )
      .then(isAdmin => {
        const actions = store.getActions();

        expect(collection).toHaveBeenCalledTimes(2);
        expect(collection).toHaveBeenNthCalledWith(1, 'groups');
        expect(collection).toHaveBeenNthCalledWith(2, 'groups');

        expect(groupDoc).toHaveBeenCalledTimes(2);
        expect(groupDoc).toHaveBeenNthCalledWith(1, groupTaskGid);
        expect(groupDoc).toHaveBeenNthCalledWith(2, groupTaskGid);

        expect(groupOneDocCollection).toHaveBeenCalledTimes(3);
        expect(groupOneDocCollection).toHaveBeenNthCalledWith(1, 'users');
        expect(groupOneDocCollection).toHaveBeenNthCalledWith(2, 'tasks');
        expect(groupOneDocCollection).toHaveBeenNthCalledWith(3, 'tasks');

        expect(groupOneUserCollectionGet).toHaveBeenCalledTimes(1);

        expect(queryGroupOneUserCollection[0].get).toHaveBeenCalledTimes(1);
        expect(queryGroupOneUserCollection[0].get).toHaveBeenLastCalledWith(
          'admin'
        );

        expect(groupOneTaskDoc).toHaveBeenCalledTimes(2);
        expect(groupOneTaskDoc).toHaveBeenNthCalledWith(1, groupTaskId);
        expect(groupOneTaskDoc).toHaveBeenNthCalledWith(2, groupTaskId);

        expect(groupOneTaskDocSet).toHaveBeenCalledTimes(1);
        expect(groupOneTaskDocSet).toHaveBeenLastCalledWith(groupUpdates);

        expect(actions).toHaveLength(2);
        expect(actions[0]).toEqual(removeDownloadURL(groupTaskId, uid));
        expect(actions[1]).toEqual(removeTask(groupTaskId));

        expect(isAdmin).toBe(true);
      });
  });

  it('should not include user if user not found in group', () =>
    store
      .dispatch(
        startEditGroupTask(
          groupTaskId,
          { ...groupUpdates, completed: { testuid: false, notPresent: true } },
          groupName,
          groupTask
        )
      )
      .then(isAdmin => {
        const actions = store.getActions();

        expect(collection).toHaveBeenCalledTimes(1);
        expect(collection).toHaveBeenLastCalledWith('groups');

        expect(groupDoc).toHaveBeenCalledTimes(1);
        expect(groupDoc).toHaveBeenLastCalledWith(groupTaskGid);

        expect(groupOneDocCollection).toHaveBeenCalledTimes(2);
        expect(groupOneDocCollection).toHaveBeenNthCalledWith(1, 'users');
        expect(groupOneDocCollection).toHaveBeenNthCalledWith(2, 'tasks');

        expect(groupOneUserCollectionGet).toHaveBeenCalledTimes(1);

        expect(queryGroupOneUserCollection[0].get).toHaveBeenCalledTimes(1);
        expect(queryGroupOneUserCollection[0].get).toHaveBeenLastCalledWith(
          'admin'
        );

        expect(groupOneTaskDoc).toHaveBeenCalledTimes(1);
        expect(groupOneTaskDoc).toHaveBeenLastCalledWith(groupTaskId);

        expect(groupOneTaskDocSet).toHaveBeenCalledTimes(1);
        expect(groupOneTaskDocSet).toHaveBeenLastCalledWith({
          ...groupUpdates,
          completed: { testuid: false }
        });

        expect(actions).toHaveLength(1);
        expect(actions[0]).toEqual(
          editTask(groupTaskId, {
            ...groupUpdates,
            completed: false,
            groupName
          })
        );

        expect(isAdmin).toBe(true);
      }));

  it('should not edit task if user is not admin', () => {
    const uid = 'differentUser';

    store = createMockStore({
      auth: {
        user: { uid }
      },
      tasks: []
    });

    return store
      .dispatch(
        startEditGroupTask(groupTaskId, groupUpdates, groupName, groupTask)
      )
      .then(isAdmin => {
        const actions = store.getActions();

        expect(collection).toHaveBeenCalledTimes(1);
        expect(collection).toHaveBeenLastCalledWith('groups');

        expect(groupDoc).toHaveBeenCalledTimes(1);
        expect(groupDoc).toHaveBeenLastCalledWith(groupTaskGid);

        expect(groupOneDocCollection).toHaveBeenCalledTimes(1);
        expect(groupOneDocCollection).toHaveBeenLastCalledWith('users');

        expect(groupOneUserCollectionGet).toHaveBeenCalledTimes(1);

        expect(queryGroupOneUserCollection[1].get).toHaveBeenCalledTimes(1);
        expect(queryGroupOneUserCollection[1].get).toHaveBeenLastCalledWith(
          'admin'
        );

        expect(actions).toHaveLength(0);

        expect(isAdmin).toBe(false);
      });
  });
});

describe('set tasks', () => {
  it('should generate action object', () =>
    expect(setTasks(tasks)).toEqual({ type: 'SET_TASKS', tasks }));

  it('should get personal and group tasks from firestore', () =>
    store.dispatch(startSetTasks()).then(() => {
      const actions = store.getActions();

      expect(collection).toHaveBeenCalledTimes(2);
      expect(collection).toHaveBeenNthCalledWith(1, 'users');
      expect(collection).toHaveBeenNthCalledWith(2, 'groups');

      expect(userDoc).toHaveBeenCalledTimes(1);
      expect(userDoc).toHaveBeenLastCalledWith(uid);

      expect(userDocCollection).toHaveBeenCalledTimes(1);
      expect(userDocCollection).toHaveBeenLastCalledWith('tasks');

      expect(userTaskCollectionGet).toHaveBeenCalledTimes(1);

      expect(queryUserTaskSnapshot).toHaveLength(1);
      expect(queryUserTaskSnapshot[0].data).toHaveBeenCalledTimes(1);
      expect(queryUserTaskSnapshot[0].data()).toEqual(tasks[0]);

      expect(userDocGet).toHaveBeenCalledTimes(1);

      expect(userDocSnapshotGet).toHaveBeenCalledTimes(1);
      expect(userDocSnapshotGet).toHaveBeenLastCalledWith('groups');

      expect(groupDoc).toHaveBeenCalledTimes(3);
      for (let i = 1; i <= 3; i++)
        expect(groupDoc).toHaveBeenNthCalledWith(i, user.groups[i - 1]);

      expect(groupOneDocGet).toHaveBeenCalledTimes(1);

      expect(groupOneDocSnapshotGet).toHaveBeenCalledTimes(1);
      expect(groupOneDocSnapshotGet).toHaveBeenLastCalledWith('name');

      expect(groupOneDocCollection).toHaveBeenCalledTimes(1);
      expect(groupOneDocCollection).toHaveBeenLastCalledWith('tasks');

      expect(groupOneTaskCollectionGet).toHaveBeenCalledTimes(1);

      expect(queryGroupOneTaskSnapshot).toHaveLength(1);
      expect(queryGroupOneTaskSnapshot[0].get).toHaveBeenCalledTimes(2);
      expect(queryGroupOneTaskSnapshot[0].get).toHaveBeenNthCalledWith(
        1,
        'completed'
      );
      expect(queryGroupOneTaskSnapshot[0].get).toHaveBeenNthCalledWith(
        2,
        'completed'
      );

      expect(groupTwoDocGet).toHaveBeenCalledTimes(1);

      expect(groupTwoDocSnapshotGet).toHaveBeenCalledTimes(1);
      expect(groupTwoDocSnapshotGet).toHaveBeenLastCalledWith('name');

      expect(groupTwoDocCollection).toHaveBeenCalledTimes(1);
      expect(groupTwoDocCollection).toHaveBeenLastCalledWith('tasks');

      expect(groupTwoTaskCollectionGet).toHaveBeenCalledTimes(1);

      expect(queryGroupTwoTaskSnapshot).toHaveLength(1);
      expect(queryGroupTwoTaskSnapshot[0].get).toHaveBeenCalledTimes(1);
      expect(queryGroupTwoTaskSnapshot[0].get).toHaveBeenNthCalledWith(
        1,
        'completed'
      );

      expect(groupThreeDocGet).toHaveBeenCalledTimes(1);

      expect(groupThreeDocSnapshotGet).toHaveBeenCalledTimes(1);
      expect(groupThreeDocSnapshotGet).toHaveBeenLastCalledWith('name');

      expect(groupThreeDocCollection).toHaveBeenCalledTimes(1);
      expect(groupThreeDocCollection).toHaveBeenLastCalledWith('tasks');

      expect(groupThreeTaskCollectionGet).toHaveBeenCalledTimes(1);

      expect(queryGroupThreeTaskSnapshot).toHaveLength(1);
      expect(queryGroupThreeTaskSnapshot[0].get).toHaveBeenCalledTimes(2);
      expect(queryGroupThreeTaskSnapshot[0].get).toHaveBeenNthCalledWith(
        1,
        'completed'
      );
      expect(queryGroupThreeTaskSnapshot[0].get).toHaveBeenNthCalledWith(
        2,
        'completed'
      );

      expect(actions).toHaveLength(1);
      expect(actions[0]).toEqual(
        setTasks([
          tasks[0],
          {
            ...groupTasks[0],
            gid: user.groups[0],
            groupName: 'groupOne',
            completed: groupTasks[0].completed[uid]
          },
          {
            ...groupTasks[2],
            gid: user.groups[2],
            groupName: 'groupThree',
            completed: groupTasks[2].completed[uid]
          }
        ])
      );
    }));
});

describe('toggle completed state for task', () => {
  const completedState = task.completed;
  it('should generate action object', () => {
    expect(toggleCompleted(id, completedState)).toEqual({
      type: 'TOGGLE_COMPLETED',
      id,
      completedState
    });
  });

  it('should toggle completed state for personal task in firestore', () =>
    store
      .dispatch(startToggleCompletedPersonal(id, completedState))
      .then(() => {
        const actions = store.getActions();

        expect(collection).toHaveBeenCalledTimes(1);
        expect(collection).toHaveBeenLastCalledWith('users');

        expect(userDoc).toHaveBeenCalledTimes(1);
        expect(userDoc).toHaveBeenLastCalledWith(uid);

        expect(userDocCollection).toHaveBeenCalledTimes(1);
        expect(userDocCollection).toHaveBeenLastCalledWith('tasks');

        expect(userTaskDoc).toHaveBeenCalledTimes(1);
        expect(userTaskDoc).toHaveBeenLastCalledWith(id);

        expect(userTaskUpdate).toHaveBeenCalledTimes(1);
        expect(userTaskUpdate).toHaveBeenLastCalledWith({
          completed: !completedState
        });

        expect(actions).toHaveLength(1);
        expect(actions[0]).toEqual(toggleCompleted(id, completedState));
      }));

  it('should toggle completed state for group task in firestore', () =>
    store
      .dispatch(
        startToggleCompletedGroup(
          groupTaskId,
          groupTaskGid,
          groupTask.completed.testuid
        )
      )
      .then(returnValue => {
        const actions = store.getActions();
        const toggle = {};
        toggle[`completed.${uid}`] = !completedState;

        expect(collection).toHaveBeenCalledTimes(1);
        expect(collection).toHaveBeenLastCalledWith('groups');

        expect(groupDoc).toHaveBeenCalledTimes(1);
        expect(groupDoc).toHaveBeenLastCalledWith(groupTaskGid);

        expect(groupOneDocCollection).toHaveBeenCalledTimes(1);
        expect(groupOneDocCollection).toHaveBeenLastCalledWith('tasks');

        expect(groupOneTaskDoc).toHaveBeenCalledTimes(1);
        expect(groupOneTaskDoc).toHaveBeenLastCalledWith(groupTaskId);

        expect(groupOneTaskDocGet).toHaveBeenCalledTimes(1);

        expect(groupOneTaskDocUpdate).toHaveBeenCalledTimes(1);
        expect(groupOneTaskDocUpdate).toHaveBeenLastCalledWith(toggle);

        expect(actions).toHaveLength(1);
        expect(actions[0]).toEqual(
          toggleCompleted(groupTaskId, groupTask.completed.testuid)
        );

        expect(returnValue).toBe(true);
      }));

  it('should remove task from store and not write to firestore if user not involved', () =>
    store
      .dispatch(
        startToggleCompletedGroup(groupTasks[1].id, groupTasks[1].gid, false)
      )
      .then(returnValue => {
        const actions = store.getActions();

        expect(collection).toHaveBeenCalledTimes(1);
        expect(collection).toHaveBeenLastCalledWith('groups');

        expect(groupDoc).toHaveBeenCalledTimes(1);
        expect(groupDoc).toHaveBeenLastCalledWith(groupTasks[1].gid);

        expect(groupTwoDocCollection).toHaveBeenCalledTimes(1);
        expect(groupTwoDocCollection).toHaveBeenLastCalledWith('tasks');

        expect(groupTwoTaskDoc).toHaveBeenCalledTimes(1);
        expect(groupTwoTaskDoc).toHaveBeenLastCalledWith(groupTasks[1].id);

        expect(groupTwoTaskDocGet).toHaveBeenCalledTimes(1);

        expect(actions).toHaveLength(1);
        expect(actions[0]).toEqual(removeTask(groupTasks[1].id));

        expect(returnValue).toBe(false);
      }));
});

describe('remove task data', () => {
  it('should generate action object', () =>
    expect(removeTaskData()).toEqual({ type: 'REMOVE_TASK_DATA' }));
});

describe('get group tasks', () => {
  it('should get all tasks in groupOne', () =>
    store.dispatch(getAllGroupTasks(groupTaskGid)).then(tasks => {
      expect(collection).toHaveBeenCalledTimes(1);
      expect(collection).toHaveBeenLastCalledWith('groups');

      expect(groupDoc).toHaveBeenCalledTimes(1);
      expect(groupDoc).toHaveBeenLastCalledWith(groupTaskGid);

      expect(groupOneDocCollection).toHaveBeenCalledTimes(1);
      expect(groupOneDocCollection).toHaveBeenLastCalledWith('tasks');

      expect(groupOneTaskCollectionGet).toHaveBeenCalledTimes(1);

      expect(tasks).toEqual([groupTask]);
    }));

  it('should get all tasks in groupTwo', () =>
    store.dispatch(getAllGroupTasks(groupTasks[1].gid)).then(tasks => {
      expect(collection).toHaveBeenCalledTimes(1);
      expect(collection).toHaveBeenLastCalledWith('groups');

      expect(groupDoc).toHaveBeenCalledTimes(1);
      expect(groupDoc).toHaveBeenLastCalledWith(groupTasks[1].gid);

      expect(groupTwoDocCollection).toHaveBeenCalledTimes(1);
      expect(groupTwoDocCollection).toHaveBeenLastCalledWith('tasks');

      expect(groupTwoTaskCollectionGet).toHaveBeenCalledTimes(1);

      expect(tasks).toEqual([groupTasks[1]]);
    }));
});

describe('update download url', () => {
  const downloadURL = 'abc.com';
  const fileName = 'file.pdf';

  it('should generate action object', () =>
    expect(updateDownloadURL(uid, groupTaskId, downloadURL, fileName)).toEqual({
      type: 'UPDATE_DOWNLOAD_URL',
      downloadURL,
      id: groupTaskId,
      uid,
      fileName
    }));

  it('should update download url in firestore', () =>
    store
      .dispatch(
        startUpdateDownloadURL(groupTaskId, groupTaskGid, downloadURL, fileName)
      )
      .then(() => {
        const actions = store.getActions();
        const update = {};
        update[`downloadURLs.${uid}`] = { downloadURL, fileName };

        expect(collection).toHaveBeenCalledTimes(1);
        expect(collection).toHaveBeenLastCalledWith('groups');

        expect(groupDoc).toHaveBeenCalledTimes(1);
        expect(groupDoc).toHaveBeenLastCalledWith(groupTaskGid);

        expect(groupOneDocCollection).toHaveBeenCalledTimes(1);
        expect(groupOneDocCollection).toHaveBeenLastCalledWith('tasks');

        expect(groupOneTaskDoc).toHaveBeenCalledTimes(1);
        expect(groupOneTaskDoc).toHaveBeenLastCalledWith(groupTaskId);

        expect(groupOneTaskDocUpdate).toHaveBeenCalledTimes(1);
        expect(groupOneTaskDocUpdate).toHaveBeenLastCalledWith(update);

        expect(actions).toHaveLength(1);
        expect(actions[0]).toEqual(
          updateDownloadURL(uid, groupTaskId, downloadURL, fileName)
        );
      }));
});

describe('remove download url', () => {
  it('should generate action object', () =>
    expect(removeDownloadURL(groupTaskId, uid)).toEqual({
      type: 'REMOVE_DOWNLOAD_URL',
      uid,
      id: groupTaskId
    }));

  it('should remove download url from firestore', () =>
    store
      .dispatch(startRemoveDownloadURL(groupTaskId, groupTaskGid, uid))
      .then(() => {
        const actions = store.getActions();

        expect(collection).toHaveBeenCalledTimes(1);
        expect(collection).toHaveBeenLastCalledWith('groups');

        expect(groupDoc).toHaveBeenCalledTimes(1);
        expect(groupDoc).toHaveBeenLastCalledWith(groupTaskGid);

        expect(groupOneDocCollection).toHaveBeenCalledTimes(1);
        expect(groupOneDocCollection).toHaveBeenLastCalledWith('tasks');

        expect(groupOneTaskDoc).toHaveBeenCalledTimes(1);
        expect(groupOneTaskDoc).toHaveBeenLastCalledWith(groupTaskId);

        expect(FieldValue.delete).toHaveBeenCalledTimes(1);

        const update = {};
        update[`downloadURLs.${uid}`] = deleteReturnValue;

        expect(groupOneTaskDocUpdate).toHaveBeenCalledTimes(1);
        expect(groupOneTaskDocUpdate).toHaveBeenLastCalledWith(update);

        expect(actions).toHaveLength(1);
        expect(actions[0]).toEqual(removeDownloadURL(groupTaskId, uid));
      }));
});
