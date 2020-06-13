import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import authReducer from '../reducers/auth';
import userReducer from '../reducers/user';
import tasksReducer from '../reducers/tasks';
import filtersReducer from '../reducers/filters';
import groupsReducer from '../reducers/groups';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const configureStore = () =>
  createStore(
    combineReducers({
      auth: authReducer,
      user: userReducer,
      groups: groupsReducer,
      tasks: tasksReducer,
      filters: filtersReducer
    }),
    composeEnhancers(applyMiddleware(thunk))
  );

export default configureStore;
