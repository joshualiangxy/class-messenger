const userReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SET_USER_DATA':
      return { dname: action.dname, snum: action.snum };
    default:
      return state;
  }
};

export default userReducer;
