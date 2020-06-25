import createMockStore from '../../setupTests';
import tasks, { groupTasks } from '../fixtures/tasks';
import user from '../fixtures/user';
import firebase from '../../firebase/firebase';
import firestore, { collection } from '../__mocks__/firestore.mock';
import storage from '../__mocks__/firebase.storage.mock';
import {
  userDoc,
  userDocGet,
  userDocCollection,
  userDocSnapshotGet
} from '../__mocks__/firestore/users';
import {
  userTaskDoc,
  userTaskSet,
  userTaskDocRef,
  userTaskUpdate,
  userTaskCollectionGet,
  queryUserTaskSnapshot
} from '../__mocks__/firestore/userTask';
import { groupDoc } from '../__mocks__/firestore/groups';
import {
  groupOneDocGet,
  groupOneDocCollection,
  groupOneDocSnapshotGet,
  groupOneTaskCollectionGet,
  queryGroupOneTaskSnapshot,
  groupOneTaskDoc,
  groupOneTaskDocSet,
  groupOneTaskDocRef
} from '../__mocks__/firestore/groupCollections/groupOne';
import {
  groupTwoDocGet,
  groupTwoDocCollection,
  groupTwoDocSnapshotGet,
  groupTwoTaskCollectionGet,
  queryGroupTwoTaskSnapshot,
  groupTwoTaskDoc,
  groupTwoTaskDocSet,
  groupTwoTaskDocRef
} from '../__mocks__/firestore/groupCollections/groupTwo';
import {
  groupThreeDocGet,
  groupThreeDocCollection,
  groupThreeDocSnapshotGet,
  groupThreeTaskCollectionGet,
  queryGroupThreeTaskSnapshot
} from '../__mocks__/firestore/groupCollections/groupThree';
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
  removeDownloadURL
} from '../../actions/tasks';
import { startRemoveUserFile } from '../../actions/files';

firebase.firestore = firestore;
firebase.storage = storage;

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

describe('add task', () => {
  it('should generate action object with task', () =>
    expect(addTask(task)).toEqual({ type: 'ADD_TASK', task }));

  it('should add personal task to firestore', () =>
    store.dispatch(startAddPersonalTask(task)).then(() => {
      const actions = store.getActions();

      expect(firestore).toHaveBeenCalledTimes(1);

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
    store.dispatch(startAddGroupTask(groupTask, groupName)).then(() => {
      const actions = store.getActions();

      expect(firestore).toHaveBeenCalledTimes(1);

      expect(collection).toHaveBeenCalledTimes(1);
      expect(collection).toHaveBeenLastCalledWith('groups');

      expect(groupDoc).toHaveBeenCalledTimes(1);
      expect(groupDoc).toHaveBeenLastCalledWith(groupTaskGid);

      expect(groupOneDocCollection).toHaveBeenCalledTimes(1);
      expect(groupOneDocCollection).toHaveBeenLastCalledWith('tasks');

      expect(groupOneTaskDoc).toHaveBeenCalledTimes(1);
      expect(groupOneTaskDoc).toHaveBeenLastCalledWith(groupTaskId);

      expect(groupOneTaskDocSet).toHaveBeenCalledTimes(1);
      expect(groupOneTaskDocSet).toHaveBeenLastCalledWith(groupTask);

      expect(actions).toHaveLength(1);
      expect(actions[0]).toEqual(
        addTask({ ...groupTask, groupName, completed: false })
      );
    }));

  it('should not add group task to store if user not involved', () =>
    store.dispatch(startAddGroupTask(groupTasks[1], groupName)).then(() => {
      const actions = store.getActions();

      expect(firestore).toHaveBeenCalledTimes(1);

      expect(collection).toHaveBeenCalledTimes(1);
      expect(collection).toHaveBeenLastCalledWith('groups');

      expect(groupDoc).toHaveBeenCalledTimes(1);
      expect(groupDoc).toHaveBeenLastCalledWith(groupTasks[1].gid);

      expect(groupTwoDocCollection).toHaveBeenCalledTimes(1);
      expect(groupTwoDocCollection).toHaveBeenLastCalledWith('tasks');

      expect(groupTwoTaskDoc).toHaveBeenCalledTimes(1);
      expect(groupTwoTaskDoc).toHaveBeenLastCalledWith(groupTasks[1].id);

      expect(groupTwoTaskDocSet).toHaveBeenCalledTimes(1);
      expect(groupTwoTaskDocSet).toHaveBeenLastCalledWith(groupTasks[1]);

      expect(actions).toHaveLength(0);
    }));
});

describe('remove task', () => {
  it('should generate action object', () =>
    expect(removeTask(id)).toEqual({ type: 'REMOVE_TASK', id }));

  it('should remove personal task from firestore', () =>
    store.dispatch(startRemovePersonalTask(id)).then(() => {
      const actions = store.getActions();

      expect(firestore).toHaveBeenCalledTimes(1);

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
    store.dispatch(startRemoveGroupTask(groupTaskGid, groupTaskId)).then(() => {
      const actions = store.getActions();

      expect(firestore).toHaveBeenCalledTimes(1);

      expect(collection).toHaveBeenCalledTimes(1);
      expect(collection).toHaveBeenLastCalledWith('groups');

      expect(groupDoc).toHaveBeenCalledTimes(1);
      expect(groupDoc).toHaveBeenLastCalledWith(groupTaskGid);

      expect(groupOneDocCollection).toHaveBeenCalledTimes(1);
      expect(groupOneDocCollection).toHaveBeenLastCalledWith('tasks');

      expect(groupOneTaskDoc).toHaveBeenCalledTimes(1);
      expect(groupOneTaskDoc).toHaveBeenLastCalledWith(groupTaskId);

      expect(groupOneTaskDocRef.delete).toHaveBeenCalledTimes(1);

      expect(actions).toHaveLength(1);
      expect(actions[0]).toEqual(removeTask(groupTaskId));
    }));

  it('should not remove task from store if user is not involved', () =>
    store
      .dispatch(startRemoveGroupTask(groupTasks[1].gid, groupTasks[1].id))
      .then(() => {
        const actions = store.getActions();

        expect(firestore).toHaveBeenCalledTimes(1);

        expect(collection).toHaveBeenCalledTimes(1);
        expect(collection).toHaveBeenLastCalledWith('groups');

        expect(groupDoc).toHaveBeenCalledTimes(1);
        expect(groupDoc).toHaveBeenLastCalledWith(groupTasks[1].gid);

        expect(groupTwoDocCollection).toHaveBeenCalledTimes(1);
        expect(groupTwoDocCollection).toHaveBeenLastCalledWith('tasks');

        expect(groupTwoTaskDoc).toHaveBeenCalledTimes(1);
        expect(groupTwoTaskDoc).toHaveBeenLastCalledWith(groupTasks[1].id);

        expect(groupTwoTaskDocRef.delete).toHaveBeenCalledTimes(1);

        expect(actions).toHaveLength(0);
      }));
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

      expect(firestore).toHaveBeenCalledTimes(1);

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
      .then(() => {
        const actions = store.getActions();

        expect(firestore).toHaveBeenCalledTimes(1);

        expect(collection).toHaveBeenCalledTimes(1);
        expect(collection).toHaveBeenLastCalledWith('groups');

        expect(groupDoc).toHaveBeenCalledTimes(1);
        expect(groupDoc).toHaveBeenLastCalledWith(groupTaskGid);

        expect(groupOneDocCollection).toHaveBeenCalledTimes(1);
        expect(groupOneDocCollection).toHaveBeenLastCalledWith('tasks');

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
      .then(() => {
        const actions = store.getActions();

        expect(firestore).toHaveBeenCalledTimes(1);

        expect(collection).toHaveBeenCalledTimes(1);
        expect(collection).toHaveBeenLastCalledWith('groups');

        expect(groupDoc).toHaveBeenCalledTimes(1);
        expect(groupDoc).toHaveBeenLastCalledWith(groupTaskGid);

        expect(groupOneDocCollection).toHaveBeenCalledTimes(1);
        expect(groupOneDocCollection).toHaveBeenLastCalledWith('tasks');

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
      });
  });

  it('should dispatch remove task if task was in store, but user is no longer involved', () => {
    groupUpdates.completed = {};

    return store
      .dispatch(
        startEditGroupTask(groupTaskId, groupUpdates, groupName, groupTask)
      )
      .then(() => {
        const actions = store.getActions();

        expect(firestore).toHaveBeenCalledTimes(2);

        expect(collection).toHaveBeenCalledTimes(2);
        expect(collection).toHaveBeenLastCalledWith('groups');

        expect(groupDoc).toHaveBeenCalledTimes(2);
        expect(groupDoc).toHaveBeenLastCalledWith(groupTaskGid);

        expect(groupOneDocCollection).toHaveBeenCalledTimes(2);
        expect(groupOneDocCollection).toHaveBeenLastCalledWith('tasks');

        expect(groupOneTaskDoc).toHaveBeenCalledTimes(2);
        expect(groupOneTaskDoc).toHaveBeenLastCalledWith(groupTaskId);

        expect(groupOneTaskDocSet).toHaveBeenCalledTimes(1);
        expect(groupOneTaskDocSet).toHaveBeenLastCalledWith(groupUpdates);

        expect(actions).toHaveLength(2);
        expect(actions[0]).toEqual(removeDownloadURL(groupTaskId, uid));
        expect(actions[1]).toEqual(removeTask(groupTaskId));
      });
  });
});

describe('set tasks', () => {
  it('should generate action object', () =>
    expect(setTasks(tasks)).toEqual({ type: 'SET_TASKS', tasks }));

  it('should get personal and group tasks from firestore', () =>
    store.dispatch(startSetTasks()).then(() => {
      const actions = store.getActions();

      expect(firestore).toHaveBeenCalledTimes(2);

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

        expect(firestore).toHaveBeenCalledTimes(1);

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

  it('should toggle completed state for group task in firestore', () => {});
});

describe('remove task data', () => {
  it('should generate action object', () =>
    expect(removeTaskData()).toEqual({ type: 'REMOVE_TASK_DATA' }));
});
