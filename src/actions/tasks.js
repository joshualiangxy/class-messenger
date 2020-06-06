import { v4 as uuid } from 'uuid';
import database from '../firebase/firebase';

export const addPersonalTask = task => ({
  type: 'ADD_PERSONAL_TASK',
  task
});

export const startAddPersonalTask = task => {
  return (dispatch, getState) => {
    const uid = getState().auth.user.uid;
    const id = uuid();

    return database
      .collection('users')
      .doc(uid)
      .collection('tasks')
      .doc(id)
      .set(task)
      .then(() => dispatch(addPersonalTask({ id, ...task })));
  };
};

export const removeTask = id => ({
  type: 'REMOVE_TASK',
  id
});

export const startRemovePersonalTask = id => {
  return (dispatch, getState) => {
    const uid = getState().auth.user.uid;

    return database
      .collection('users')
      .doc(uid)
      .collection('tasks')
      .doc(id)
      .delete()
      .then(() => dispatch(removeTask(id)));
  };
};

export const editTask = (id, updates) => ({
  type: 'EDIT_TASK',
  id,
  updates
});

export const setTasks = tasks => ({
  type: 'SET_TASK',
  tasks
});

export const startSetTasks = () => {
  return (dispatch, getState) => {
    const uid = getState().auth.user.uid;
    const tasks = [];

    return database
      .collection('users')
      .doc(uid)
      .collection('tasks')
      .get()
      .then(querySnapshot =>
        querySnapshot.forEach(queryDocSnapshot =>
          tasks.push({ id: queryDocSnapshot.id, ...queryDocSnapshot.data() })
        )
      )
      .then(() => {
        database
          .collection('users')
          .doc(uid)
          .get()
          .then(docSnapshot => {
            const groupIds = docSnapshot.get('groups') || [];

            groupIds.forEach(gid =>
              database
                .collection('groups')
                .doc(gid)
                .collection('tasks')
                .get()
                .then(querySnapshot =>
                  querySnapshot.forEach(queryDocSnapshot =>
                    tasks.push({
                      isGroup: true,
                      id: queryDocSnapshot.id,
                      ...queryDocSnapshot.data()
                    })
                  )
                )
            );
          });
      })
      .then(() => dispatch(setTasks(tasks)));
  };
};
