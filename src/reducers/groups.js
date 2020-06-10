const groupsReducer = (state = { groups: [] }, action) => {
  switch (action.type) {
    case 'NEW_GROUP':
      {
      const newGroups = state.groups;
      newGroups.push(action.groupId);
      return {groups: newGroups}}
    case 'GET_GROUPS':
      // TODO: make it spread so 
      const newGroups = action.groups;
      return {groups: newGroups}
    default:
      return state;
  }
};

export default groupsReducer;
