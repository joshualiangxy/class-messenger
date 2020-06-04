import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import authReducer from '../reducers/auth';
import userReducer from '../reducers/user';
import tasksReducer from '../reducers/tasks';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const configureStore = () =>
  createStore(
    combineReducers({
      auth: authReducer,
      user: userReducer,
      tasks: tasksReducer
    }),
    composeEnhancers(applyMiddleware(thunk))
  );

export default configureStore;
