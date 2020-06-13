const groupsReducer = (state = [], action) => {
  switch (action.type) {
    case 'NEW_GROUP':
      const newGroup = { name: action.name, gid: action.groupId };
      return [...state, newGroup];
    case 'SET_GROUPS':
      return action.groups;
    case 'LEAVE_GROUP':
      return state.filter(group => group.gid !== action.gid);
    default:
      return state;
  }
};

export default groupsReducer;
