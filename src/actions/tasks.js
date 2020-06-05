import database from '../firebase/firebase';

export const addPersonalTask = task => ({
  type: 'ADD_PERSONAL_TASK',
  task
});

export const startAddPersonalTask = task => {
  return (dispatch, getState) => {
    const uid = getState().auth.user.uid;

    return database
      .collection('users')
      .doc(uid)
      .collection('tasks')
      .add(task)
      .then(doc =>
        dispatch(
          addPersonalTask({
            id: doc.id,
            ...task
          })
        )
      );
  };
};

export const removeTask = id => ({
  type: 'REMOVE_TASK',
  id
});

export const editTask = (id, updates) => ({
  type: 'EDIT_TASK',
  id,
  updates
});

export const setTasks = tasks => ({
  type: 'SET_TASK',
  tasks
});
