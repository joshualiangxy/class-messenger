const tasksReducer = (state = [], action) => {
  switch (action.type) {
    case 'ADD_PERSONAL_TASK':
      return [...state, action.task];
    case 'REMOVE_PERSONAL_TASK':
      return state.filter(task => task.id !== action.id);
    case 'EDIT_PERSONAL_TASK':
      return state.map(task => (task.id === action.id ? action.updates : task));
    case 'SET_TASKS':
      return action.tasks;
    case 'TOGGLE_COMPLETED_PERSONAL':
      return state.map(task =>
        task.id !== action.id
          ? task
          : {
              ...task,
              completed: !action.completedState
            }
      );
    case 'REMOVE_TASK_DATA':
      return [];
    default:
      return state;
  }
};

export default tasksReducer;
