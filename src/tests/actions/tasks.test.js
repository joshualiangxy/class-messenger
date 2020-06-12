import createMockStore from '../../setupTests';
import tasks from '../fixtures/tasks';
import user from '../fixtures/user';
import firebase from '../../firebase/firebase';
import firestore, { collection } from '../__mocks__/firestore.mock';
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
  queryGroupOneTaskSnapshot
} from '../__mocks__/firestore/groupCollections/groupOne';
import {
  groupTwoDocGet,
  groupTwoDocCollection,
  groupTwoDocSnapshotGet,
  groupTwoTaskCollectionGet,
  queryGroupTwoTaskSnapshot
} from '../__mocks__/firestore/groupCollections/groupTwo';
import {
  groupThreeDocGet,
  groupThreeDocCollection,
  groupThreeDocSnapshotGet,
  groupThreeTaskCollectionGet,
  queryGroupThreeTaskSnapshot
} from '../__mocks__/firestore/groupCollections/groupThree';
import {
  addPersonalTask,
  startAddPersonalTask,
  removePersonalTask,
  startRemovePersonalTask,
  editPersonalTask,
  startEditPersonalTask,
  setTasks,
  startSetTasks,
  toggleCompletedPersonal,
  startToggleCompletedPersonal,
  removeTaskData
} from '../../actions/tasks';

firebase.firestore = firestore;

const uid = 'testuid';
const store = createMockStore({
  auth: {
    user: { uid }
  }
});
const task = tasks[0];
const id = task.id;

beforeEach(() => {
  jest.clearAllMocks();
  store.clearActions();
});

describe('add personal task', () => {
  it('should generate action object with task', () =>
    expect(addPersonalTask(task)).toEqual({ type: 'ADD_PERSONAL_TASK', task }));

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
      expect(actions[0]).toEqual(addPersonalTask(task));
    }));
});

describe('remove personal task', () => {
  it('should generate action object', () =>
    expect(removePersonalTask(id)).toEqual({
      type: 'REMOVE_PERSONAL_TASK',
      id
    }));

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
      expect(actions[0]).toEqual(removePersonalTask(id));
    }));
});

describe('edit personal task', () => {
  const updates = tasks[1];

  it('should generate action object', () => {
    expect(editPersonalTask(id, updates)).toEqual({
      type: 'EDIT_PERSONAL_TASK',
      id,
      updates
    });
  });

  it('should update personal task in firestore', () =>
    store.dispatch(startEditPersonalTask(id, updates)).then(() => {
      const actions = store.getActions();

      expect(firestore).toHaveBeenCalledTimes(1);

      expect(collection).toHaveBeenCalledTimes(1);
      expect(collection).toHaveBeenLastCalledWith('users');

      expect(userDoc).toHaveBeenCalledTimes(1);
      expect(userDoc).toHaveBeenLastCalledWith(uid);

      expect(userTaskUpdate).toHaveBeenCalledTimes(1);
      expect(userTaskUpdate).toHaveBeenLastCalledWith(updates);

      expect(actions).toHaveLength(1);
      expect(actions[0]).toEqual(editPersonalTask(id, updates));
    }));
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
      expect(queryGroupOneTaskSnapshot[0].data).toHaveBeenCalledTimes(1);

      expect(groupTwoDocGet).toHaveBeenCalledTimes(1);

      expect(groupTwoDocSnapshotGet).toHaveBeenCalledTimes(1);
      expect(groupTwoDocSnapshotGet).toHaveBeenLastCalledWith('name');

      expect(groupTwoDocCollection).toHaveBeenCalledTimes(1);
      expect(groupTwoDocCollection).toHaveBeenLastCalledWith('tasks');

      expect(groupTwoTaskCollectionGet).toHaveBeenCalledTimes(1);

      expect(queryGroupTwoTaskSnapshot).toHaveLength(1);
      expect(queryGroupTwoTaskSnapshot[0].data).toHaveBeenCalledTimes(1);

      expect(groupThreeDocGet).toHaveBeenCalledTimes(1);

      expect(groupThreeDocSnapshotGet).toHaveBeenCalledTimes(1);
      expect(groupThreeDocSnapshotGet).toHaveBeenLastCalledWith('name');

      expect(groupThreeDocCollection).toHaveBeenCalledTimes(1);
      expect(groupThreeDocCollection).toHaveBeenLastCalledWith('tasks');

      expect(groupThreeTaskCollectionGet).toHaveBeenCalledTimes(1);

      expect(queryGroupThreeTaskSnapshot).toHaveLength(1);
      expect(queryGroupThreeTaskSnapshot[0].data).toHaveBeenCalledTimes(1);

      expect(actions).toHaveLength(1);
      expect(actions[0]).toEqual(
        setTasks([
          tasks[0],
          {
            ...tasks[1],
            gid: user.groups[0],
            groupName: 'groupOne'
          },
          {
            ...tasks[2],
            gid: user.groups[1],
            groupName: 'groupTwo'
          },
          {
            ...tasks[3],
            gid: user.groups[2],
            groupName: 'groupThree'
          }
        ])
      );
    }));
});

describe('toggle completed state for personal task', () => {
  const completedState = task.completed;
  it('should generate action object', () => {
    expect(toggleCompletedPersonal(id, completedState)).toEqual({
      type: 'TOGGLE_COMPLETED_PERSONAL',
      id,
      completedState
    });
  });

  it('should toggle completed state for task in firestore', () =>
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
        expect(actions[0]).toEqual(toggleCompletedPersonal(id, completedState));
      }));
});

describe('remove task data', () => {
  it('should generate action object', () =>
    expect(removeTaskData()).toEqual({ type: 'REMOVE_TASK_DATA' }));
});
