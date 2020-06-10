import firebase from '../firebase/firebase';

export const addPersonalTask = task => ({ type: 'ADD_PERSONAL_TASK', task });

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
      .then(() => dispatch(addPersonalTask(task)));
  };
};

export const removePersonalTask = id => ({ type: 'REMOVE_PERSONAL_TASK', id });

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
      .then(() => dispatch(removePersonalTask(id)));
  };
};

export const editPersonalTask = (id, updates) => ({
  type: 'EDIT_PERSONAL_TASK',
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
      .then(dispatch(editPersonalTask(id, updates)));
  };
};

export const setTasks = tasks => ({ type: 'SET_TASK', tasks });

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
          tasks.push({ id: queryDocSnapshot.id, ...queryDocSnapshot.data() })
        )
      )
      .then(() => {
        userRef.get().then(userDocSnapshot => {
          const groupIds = userDocSnapshot.get('groups') || [];
          const groupsPromises = [];

          groupIds.forEach(gid => {
            const groupPromises = [];
            const groupRef = firebase.firestore().collection('groups').doc(gid);

            groupPromises.push(
              groupRef
                .get()
                .then(groupDocSnapshot => groupDocSnapshot.get('name'))
            );
            groupPromises.push(groupRef.collection('tasks').get());

            groupsPromises.push(
              Promise.all(groupPromises).then(
                ([groupName, queryTaskCollectionSnapshot]) =>
                  queryTaskCollectionSnapshot.forEach(queryTaskDocSnapshot =>
                    tasks.push({
                      groupName,
                      gid,
                      id: queryTaskDocSnapshot.id,
                      ...queryTaskDocSnapshot.data()
                    })
                  )
              )
            );

            return Promise.all(groupPromises);
          });
        });
      })
      .then(() => dispatch(setTasks(tasks)));
  };
};

export const toggleCompletedPersonal = (id, completedState) => ({
  type: 'TOGGLE_COMPLETED_PERSONAL',
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
      .then(() => toggleCompletedPersonal(id, completedState));
  };
};

export const removeTaskData = () => ({ type: 'REMOVE_TASK_DATA' });
