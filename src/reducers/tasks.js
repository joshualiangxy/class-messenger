const tasksReducer = (state = [], action) => {
  switch (action.type) {
    case 'ADD_PERSONAL_TASK':
      return [...state, action.task];
    case 'REMOVE_PERSONAL_TASK':
      return state.filter(task => task.id !== action.id);
    case 'EDIT_PERSONAL_TASK':
      return state.map(task => (task.id === action.id ? action.updates : task));
    case 'SET_TASK':
      return action.tasks;
    case 'TOGGLE_COMPLETED':
      console.log(
        state.map(task =>
          task.id !== action.id
            ? task
            : {
                ...task,
                completed: action.completedState
              }
        )
      );
      return state.map(task =>
        task.id !== action.id
          ? task
          : {
              ...task,
              completed: action.completedState
            }
      );
    default:
      return state;
  }
};

export default tasksReducer;
