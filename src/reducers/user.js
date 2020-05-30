const userReducer = (state = {}, action) => {
  switch (action.type) {
    case 'GET_USER_DATA':
    case 'SET_USER_DATA':
      return {
        displayName: action.displayName,
        studentNum: action.studentNum
      };
    case 'NEW_USER':
      return { newUser: true, ...state };
    case 'REMOVE_USER_DATA':
      return {};
    default:
      return state;
  }
};

export default userReducer;
