const defaultUserState = {
  displayName: '',
  studentNum: '',
  groups: [],
  newUser: false
};

const userReducer = (state = defaultUserState, action) => {
  switch (action.type) {
    case 'GET_USER_DATA':
    case 'SET_USER_DATA':
      return {
        displayName: action.displayName,
        studentNum: action.studentNum,
        groups: action.groups || state.groups,
        newUser: false
      };
    case 'NEW_USER':
      return { ...state, newUser: true };
    case 'REMOVE_USER_DATA':
      return {};
    case 'ADD_GROUP':
      return { ...state, groups: [...state.groups, action.gid] };
    case 'REMOVE_GROUP':
      return {
        ...state,
        groups: state.groups.filter(groupId => groupId !== action.gid)
      };
    default:
      return state;
  }
};

export default userReducer;
