import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import * as serviceWorker from './serviceWorker';
import firebase from './firebase/firebase';
import AppRouter, { history } from './routers/AppRouter';
import { login, logout } from './actions/auth';
import { startNewUser, startGetUserData } from './actions/user';
import { startSetTasks } from './actions/tasks';
import { startSetGroups } from './actions/groups';
import LoadingPage from './components/LoadingPage';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import './styles/styles.scss';

const store = configureStore();

const app = (
  <Provider store={store}>
    <AppRouter />
  </Provider>
);

const renderApp = () => {
  ReactDOM.render(app, document.getElementById('root'));
};

const firstLogin = user => {
  const userRef = firebase.firestore().collection('users').doc(user.uid);

  return userRef
    .get()
    .then(snapshot =>
      snapshot.exists
        ? store.dispatch(startGetUserData())
        : store.dispatch(startNewUser())
    );
};

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    ReactDOM.render(<LoadingPage />, document.getElementById('root'));
    store.dispatch(login(user));
    firstLogin(user)
      .then(() => store.dispatch(startSetGroups())) // Not finishing properly
      .then(() => store.dispatch(startSetTasks()))
      .then(() => renderApp())
      .then(
        () => history.location.pathname === '/' && history.push('/dashboard')
      );
  } else {
    store.dispatch(logout());
    renderApp();
    history.push('/');
  }
});

serviceWorker.unregister();
