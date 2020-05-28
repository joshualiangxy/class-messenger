import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './styles/index.css';
import configureStore from './store/configureStore';
import * as serviceWorker from './serviceWorker';
import { firebase } from './firebase/firebase';
import AppRouter, { history } from './routers/AppRouter';
import { login, logout } from './actions/auth';
import LoadingPage from './components/LoadingPage';

const store = configureStore();

const app = (
  <Provider store={store}>
    <AppRouter />
  </Provider>
);

ReactDOM.render(<LoadingPage />, document.getElementById('root'));

let rendered = false;

const renderApp = () => {
  if (!rendered) {
    ReactDOM.render(app, document.getElementById('root'));
    rendered = true;
  }
};

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    store.dispatch(login(user));
    renderApp();
    if (history.location.pathname === '/') history.push('/dashboard');
  } else {
    store.dispatch(logout());
    renderApp();
    history.push('/');
  }
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
