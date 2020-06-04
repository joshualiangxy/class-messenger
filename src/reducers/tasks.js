const tasksReducer = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TASK':
      return [...state, action.task];
    case 'REMOVE_TASK':
      return state.filter(task => task.id !== action.id);
    case 'EDIT_TASK':
      return state.map(task =>
        task.id === action.id
          ? {
              ...task,
              ...action.updates
            }
          : task
      );
    case 'SET_TASK':
      return action.tasks;
    default:
      return state;
  }
};

export default tasksReducer;
