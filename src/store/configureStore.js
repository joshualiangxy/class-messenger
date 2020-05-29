import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import authReducer from '../reducers/auth';
import userReducer from '../reducers/user';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const configureStore = () =>
  createStore(
    combineReducers({ auth: authReducer, user: userReducer }),
    composeEnhancers(applyMiddleware(thunk))
  );

export default configureStore;
