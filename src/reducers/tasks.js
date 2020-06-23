const tasksReducer = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TASK':
      return [...state, action.task];
    case 'REMOVE_TASK':
      return state.filter(task => task.id !== action.id);
    case 'EDIT_TASK':
      return state.map(task => (task.id === action.id ? action.updates : task));
    case 'SET_TASKS':
      return action.tasks;
    case 'TOGGLE_COMPLETED':
      return state.map(task =>
        task.id !== action.id
          ? task
          : {
              ...task,
              completed: !action.completedState
            }
      );
    case 'UPDATE_DOWNLOAD_URL':
      return state.map(task =>
        task.id !== action.id
          ? task
          : {
              ...task,
              downloadURLs: {
                ...task.downloadURLs,
                [action.uid]: {
                  downloadURL: action.downloadURL,
                  fileName: action.fileName
                }
              }
            }
      );
    case 'REMOVE_DOWNLOAD_URL':
      return state.map(task => {
        if (task.id !== action.id) return task;
        else {
          const { [action.uid]: omit, ...rest } = task.downloadURLs;
          return { ...task, downloadURLs: rest };
        }
      });
    case 'REMOVE_TASK_DATA':
      return [];
    default:
      return state;
  }
};

export default tasksReducer;
