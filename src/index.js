import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import * as serviceWorker from './serviceWorker';
import database, { firebase } from './firebase/firebase';
import AppRouter, { history } from './routers/AppRouter';
import { login, logout } from './actions/auth';
import { newUser, startGetUserData } from './actions/user';
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
  const userRef = database.collection('users').doc(user.uid);

  return userRef
    .get()
    .then(snapshot =>
      snapshot.exists
        ? store.dispatch(startGetUserData())
        : store.dispatch(newUser())
    );
};

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    ReactDOM.render(<LoadingPage />, document.getElementById('root'));
    store.dispatch(login(user));
    firstLogin(user)
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
