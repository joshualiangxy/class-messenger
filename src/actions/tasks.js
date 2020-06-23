import firebase from '../firebase/firebase';
import { startRemoveUserFile } from './files';

export const addTask = task => ({ type: 'ADD_TASK', task });

export const startAddPersonalTask = task => {
  return (dispatch, getState) => {
    const uid = getState().auth.user.uid;
    const id = task.id;

    return firebase
      .firestore()
      .collection('users')
      .doc(uid)
      .collection('tasks')
      .doc(id)
      .set(task)
      .then(() => dispatch(addTask(task)));
  };
};

export const startAddGroupTask = (task, groupName) => {
  return (dispatch, getState) =>
    firebase
      .firestore()
      .collection('groups')
      .doc(task.gid)
      .collection('tasks')
      .doc(task.id)
      .set(task)
      .then(() => {
        const uid = getState().auth.user.uid;
        const userInvolved = task.completed.hasOwnProperty(uid);
        if (userInvolved)
          dispatch(addTask({ ...task, groupName, completed: false }));
      });
};

export const removeTask = id => ({ type: 'REMOVE_TASK', id });

export const startRemovePersonalTask = id => {
  return (dispatch, getState) => {
    const uid = getState().auth.user.uid;

    return firebase
      .firestore()
      .collection('users')
      .doc(uid)
      .collection('tasks')
      .doc(id)
      .delete()
      .then(() => dispatch(removeTask(id)));
  };
};

export const startRemoveGroupTask = (gid, id) => {
  return (dispatch, getState) =>
    firebase
      .firestore()
      .collection('groups')
      .doc(gid)
      .collection('tasks')
      .doc(id)
      .delete()
      .then(() => {
        const task = getState().tasks.find(task => task.id === id);
        if (task) dispatch(removeTask(id));
      });
};

export const editTask = (id, updates) => ({
  type: 'EDIT_TASK',
  id,
  updates
});

export const startEditPersonalTask = (id, updates) => {
  return (dispatch, getState) => {
    const uid = getState().auth.user.uid;

    return firebase
      .firestore()
      .collection('users')
      .doc(uid)
      .collection('tasks')
      .doc(id)
      .set(updates)
      .then(() => dispatch(editTask(id, updates)));
  };
};

export const startEditGroupTask = (id, updates, groupName, originalTask) => {
  return (dispatch, getState) =>
    firebase
      .firestore()
      .collection('groups')
      .doc(updates.gid)
      .collection('tasks')
      .doc(id)
      .set(updates)
      .then(() => {
        const uid = getState().auth.user.uid;
        const task = getState().tasks.find(task => task.id === id);
        const originalUsersInvolved = Object.keys(originalTask.completed);
        const usersInvolved = Object.keys(updates.completed);
        const userInvolved = updates.completed.hasOwnProperty(uid);
        const promises = [];

        originalUsersInvolved.forEach(uid => {
          if (!usersInvolved.includes(uid))
            promises.push(
              dispatch(startRemoveUserFile(id, uid)).then(() =>
                dispatch(startRemoveDownloadURL(id, updates.gid, uid))
              )
            );
        });

        return Promise.all(promises).then(() => {
          if (userInvolved) {
            if (task) {
              const completed = task.completed;
              dispatch(editTask(id, { ...updates, groupName, completed }));
            } else
              dispatch(addTask({ ...updates, groupName, completed: false }));
          } else if (task) {
            dispatch(removeTask(id));
          }
        });
      });
};

export const setTasks = tasks => ({ type: 'SET_TASKS', tasks });

export const startSetTasks = () => {
  return (dispatch, getState) => {
    const uid = getState().auth.user.uid;
    const tasks = [];
    const userRef = firebase.firestore().collection('users').doc(uid);
    const tasksRef = userRef.collection('tasks');

    return tasksRef
      .get()
      .then(querySnapshot =>
        querySnapshot.forEach(queryDocSnapshot =>
          tasks.push(queryDocSnapshot.data())
        )
      )
      .then(() =>
        userRef.get().then(userDocSnapshot => {
          const groupsCollection = firebase.firestore().collection('groups');
          const groupIds = userDocSnapshot.get('groups') || [];
          const groupsPromises = [];

          groupIds.forEach(gid => {
            const groupPromises = [];
            const groupRef = groupsCollection.doc(gid);

            groupPromises.push(
              groupRef
                .get()
                .then(groupDocSnapshot => groupDocSnapshot.get('name'))
            );
            groupPromises.push(groupRef.collection('tasks').get());

            groupsPromises.push(
              Promise.all(groupPromises).then(
                ([groupName, queryTaskCollectionSnapshot]) =>
                  queryTaskCollectionSnapshot.forEach(queryTaskDocSnapshot => {
                    if (
                      queryTaskDocSnapshot.get('completed').hasOwnProperty(uid)
                    )
                      tasks.push({
                        ...queryTaskDocSnapshot.data(),
                        groupName,
                        completed: queryTaskDocSnapshot.get('completed')[uid]
                      });
                  })
              )
            );
          });

          return Promise.all(groupsPromises);
        })
      )
      .then(() => dispatch(setTasks(tasks)));
  };
};

export const toggleCompleted = (id, completedState) => ({
  type: 'TOGGLE_COMPLETED',
  id,
  completedState
});

export const startToggleCompletedPersonal = (id, completedState) => {
  return (dispatch, getState) => {
    const uid = getState().auth.user.uid;

    return firebase
      .firestore()
      .collection('users')
      .doc(uid)
      .collection('tasks')
      .doc(id)
      .update({ completed: !completedState })
      .then(() => dispatch(toggleCompleted(id, completedState)));
  };
};

export const startToggleCompletedGroup = (id, gid, completedState) => {
  return (dispatch, getState) => {
    const uid = getState().auth.user.uid;
    const toggle = {};
    const taskRef = firebase
      .firestore()
      .collection('groups')
      .doc(gid)
      .collection('tasks')
      .doc(id);

    toggle[`completed.${uid}`] = !completedState;

    return taskRef.get().then(snapshot => {
      const completedState = snapshot.get('completed');

      if (completedState.hasOwnProperty(uid)) {
        return taskRef.update(toggle).then(() => {
          dispatch(toggleCompleted(id, completedState[uid]));
          return true;
        });
      } else {
        dispatch(removeTask(id));
        return false;
      }
    });
  };
};

export const removeTaskData = () => ({ type: 'REMOVE_TASK_DATA' });

export const getAllGroupTasks = gid => {
  return () =>
    firebase
      .firestore()
      .collection('groups')
      .doc(gid)
      .collection('tasks')
      .get()
      .then(tasksQuerySnapshot => {
        const tasks = [];
        tasksQuerySnapshot.forEach(taskDoc => tasks.push(taskDoc.data()));

        return tasks;
      });
};

export const updateDownloadURL = (uid, id, downloadURL, fileName) => ({
  type: 'UPDATE_DOWNLOAD_URL',
  downloadURL,
  id,
  uid,
  fileName
});

export const startUpdateDownloadURL = (id, gid, downloadURL, fileName) => {
  return (dispatch, getState) => {
    const uid = getState().auth.user.uid;
    const update = {};
    update[`downloadURLs.${uid}`] = {
      downloadURL,
      fileName
    };

    return firebase
      .firestore()
      .collection('groups')
      .doc(gid)
      .collection('tasks')
      .doc(id)
      .update(update)
      .then(() => dispatch(updateDownloadURL(uid, id, downloadURL, fileName)));
  };
};

export const removeDownloadURL = (id, uid) => ({
  type: 'REMOVE_DOWNLOAD_URL',
  uid,
  id
});

export const startRemoveDownloadURL = (id, gid, uid) => {
  return (dispatch, getState) => {
    const update = {};
    update[`downloadURLs.${uid}`] = firebase.firestore.FieldValue.delete();

    return firebase
      .firestore()
      .collection('groups')
      .doc(gid)
      .collection('tasks')
      .doc(id)
      .update(update)
      .then(() => dispatch(removeDownloadURL(id, uid)));
  };
};
